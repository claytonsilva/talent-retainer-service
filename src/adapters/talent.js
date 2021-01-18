/**
 * Reference only imports (for documentation)
*/

// eslint-disable-next-line no-unused-vars
import { Logger } from 'log4js'
// eslint-disable-next-line no-unused-vars
import { DynamoRepositoryInstance, QueueRepositoryInstance, EventRepositoryInstance } from '../ports/state-machines'
// eslint-disable-next-line no-unused-vars
import { MutateTalentInputCreate, MutateTalentInputUpdate, Talent, Opening } from '../business'

/**
 * code imports
 */

import {
  // eslint-disable-next-line no-unused-vars
  CustomError,
  EClassError,
  throwCustomError
} from '../utils'

import { validateUpdateTalent, validateCreateTalent, validateDeleteTalent, generateFilterExpression } from '../business/talent'
import { EOperation, EPersistOperation, validatePersistOperation } from '../business/constants'
import { sendPayloadtoQueue, sendPayloadtoSNSTopic } from './common'
import { isNil } from 'ramda'

/**
 * @description Talent adapter factory
 * @memberof adapters
 * @function
 * @param {Logger} escriba instance of escriba logger
 * @param {DynamoRepositoryInstance} repository state-machine database methods
 * @param {QueueRepositoryInstance} queueRepository state-machine queue methods
 * @param {EventRepositoryInstance} eventRepository state-machine sns methods
 * @param {EPersistOperation} persistOperation option for persist operation (validate/persist/all)
 * @returns {TalentAdapter} Talent adapter instantied
 */
const talentAdapterFactory = (escriba, repository, queueRepository, eventRepository, persistOperation = EPersistOperation.ALL) => {
  const methodPath = 'adapters.talent.talentAdapterFactory'

  const readMethods = {
    getTalent: getTalent(repository),
    matchTalentsFromOpening: matchTalentsFromOpening(escriba, repository, eventRepository)
  }

  try {
    validatePersistOperation(persistOperation)
  } catch (error) {
    escriba.error(methodPath, { ...error })

    /**
     * if cannot recognize option, the system operate in fallback option
     */
    escriba.info(`system operating in default persistence level: ${EPersistOperation.ALL}`)

    return {
      ...readMethods,
      createTalent: createTalent(escriba, repository, queueRepository, EPersistOperation.ALL),
      updateTalent: updateTalent(escriba, repository, queueRepository, EPersistOperation.ALL),
      deleteTalent: deleteTalent(escriba, repository, queueRepository, EPersistOperation.ALL)
    }
  }

  escriba.info(`system operating in persistence level: ${persistOperation}`)

  return {
    ...readMethods,
    createTalent: createTalent(escriba, repository, queueRepository, persistOperation),
    updateTalent: updateTalent(escriba, repository, queueRepository, persistOperation),
    deleteTalent: deleteTalent(escriba, repository, queueRepository, persistOperation)
  }
}

export default talentAdapterFactory

/**
 * @description Handler function to get Talent data by id .
 * @memberof adapters
 * @async
 * @function
 * @throws {CustomError}
 * @param {DynamoRepositoryInstance} repository - State-machine database methods.
 * @returns {getTalentReturn} GetDocument method ready to execute.
 */
const getTalent = (repository) => async (id, talentEconomicSegment) => {
  const methodPath = 'adapters.talent.getTalent'
  try {
    return await repository.getDocument({ id, talentEconomicSegment })
  } catch (error) {
    throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}

/**
 * @description Create Talent in the DynamoDB.
 * @memberof adapters
 * @async
 * @function
 * @throws {CustomError}
 * @param {Logger} escriba instance of escriba
 * @param {DynamoRepositoryInstance} repository state-machine database methods
 * @param {QueueRepositoryInstance} queueRepository state-machine queue methods
 * @param {EPersistOperation} persistOperation option for persist operation (validate/persist/all)
 * @returns {createTalentReturn} function to call createTalent direct
 */
const createTalent = (escriba, repository, queueRepository, persistOperation) => async (params) => {
  const methodPath = 'adapters.talent.createTalent'
  try {
    const documentValidated = validateCreateTalent(params)

    if (persistOperation === EPersistOperation.ONLY_VALIDATE) {
      // if don't have have queue response, the request will fail
      await sendPayloadtoQueue(escriba, queueRepository)(documentValidated, 'talent', EOperation.CREATE)
      return documentValidated
    }

    // validate eventual consistence for worker
    if (params.id) {
      const currObject = await getTalent(repository)(params.id, params.talentEconomicSegment)
      if (!isNil(currObject)) {
        return currObject
      }
    }

    const documentInserted = await repository
      .putDocument(
        documentValidated
      )

    escriba.info({
      action: 'TALENT_CREATED',
      method: methodPath,
      data: { documentInserted }
    })

    /***
     * important: cannot block main flow of the data
     */
    try {
      await sendPayloadtoQueue(escriba, queueRepository)(documentInserted, 'talent', EOperation.MATCH)
    } catch (error) {
      escriba.error(methodPath, { ...error })
    }

    return documentInserted
  } catch (error) {
    throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}

/**
 * @description Update Talent in the DynamoDB.
 * @memberof adapters
 * @async
 * @function
 * @throws {CustomError}
 * @param {Logger} escriba instance of escriba
 * @param {DynamoRepositoryInstance} repository state-machine database methods
 * @param {QueueRepositoryInstance} queueRepository state-machine queue methods
 * @param {EPersistOperation} persistOperation option for persist operation (validate/persist/all)
 * @returns {updateTalentReturn} function to call updateTalent direct
 */
const updateTalent = (escriba, repository, queueRepository, persistOperation) => async (id, talentEconomicSegment, params) => {
  const methodPath = 'adapters.talent.updateTalent'
  try {
    const currObject = await getTalent(repository)(id, talentEconomicSegment)
    const documentValidated = validateUpdateTalent(params, currObject)

    if (persistOperation === EPersistOperation.ONLY_VALIDATE) {
      // if don't have have queue response, the request will fail
      await sendPayloadtoQueue(escriba, queueRepository)(documentValidated, 'talent', EOperation.UPDATE)
      return documentValidated
    }

    const UpdateExpression = `
    set talentName = :talentName,
        talentSurname = :talentSurname,
        talentResume = :talentResume,
        talentSoftSkillsTags = :talentSoftSkillsTags,
        talentHardSkillsTags = :talentHardSkillsTags,
        talentPositionTags = :talentPositionTags,
        talentStatus = :talentStatus,
        lastUpdateDate = :lastUpdateDate,
        talentLastSalaryRange = :talentLastSalaryRange
    `

    // send report to existing Talent previous created
    const documentUpdated = await repository.updateDocument(
      { id, talentEconomicSegment },
      UpdateExpression,
      documentValidated
    )

    // log report data
    escriba.info({
      action: 'TALENT_UPDATED',
      method: methodPath,
      data: documentUpdated
    })

    /***
     * important: cannot block main flow of the data
     */
    try {
      await sendPayloadtoQueue(escriba, queueRepository)(documentUpdated, 'talent', EOperation.MATCH)
    } catch (error) {
      escriba.error(methodPath, { ...error })
    }

    // return updated item
    return documentUpdated
  } catch (error) {
    throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}

/**
 * @description delete Talent in the DynamoDB.
 * @memberof adapters
 * @async
 * @function
 * @throws {CustomError}
 * @param {Logger} escriba instance of escriba
 * @param {DynamoRepositoryInstance} repository state-machine database methods
 * @param {QueueRepositoryInstance} queueRepository state-machine queue methods
 * @param {EPersistOperation} persistOperation option for persist operation (validate/persist/all)
 * @returns {deleteTalentReturn} function to call deleteTalent direct
 */
const deleteTalent = (escriba, repository, queueRepository, persistOperation) => async (id, talentEconomicSegment) => {
  const methodPath = 'adapters.talent.deleteTalent'
  try {
    const currObject = validateDeleteTalent(await getTalent(repository)(id, talentEconomicSegment))

    if (persistOperation === EPersistOperation.ONLY_VALIDATE) {
      // if don't have have queue response, the request will fail
      await sendPayloadtoQueue(escriba, queueRepository)(currObject, 'talent', EOperation.DELETE)
      return currObject
    }

    await repository.deleteDocument({ id, talentEconomicSegment })

    // log report data
    escriba.info({
      action: 'TALENT_DELETED',
      method: methodPath,
      data: currObject
    })

    return currObject
  } catch (error) {
    throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}

/**
 * @description match Talents from opening entry
 * @memberof adapters
 * @async
 * @function
 * @throws {CustomError}
 * @param {Logger} escriba instance of escriba
 * @param {DynamoRepositoryInstance} repository state-machine database methods
 * @param {EventRepositoryInstance} eventRepository state-machine sns methods
 * @returns {matchTalentsFromOpeningReturn} function to call deleteTalent direct
 */
const matchTalentsFromOpening = (escriba, repository, eventRepository) => async (opening) => {
  const methodPath = 'adapters.talent.matchTalentsFromOpening'
  try {
    const { keyConditionExpression, filterExpression, expressionAttributeValuesQuery } = generateFilterExpression(opening)
    /**
     * @constant
     * @type {Array<Talent>}
     */
    const matches = await repository.queryDocument(keyConditionExpression, filterExpression, expressionAttributeValuesQuery)

    if (matches.length) {
      await sendPayloadtoSNSTopic(escriba, eventRepository)(
        'talents-matches',
        matches
          .map(talent => `id: ${talent.id} / name: ${talent.talentName} / surname: ${talent.talentSurname}`)
      )
    }
    return matches
  } catch (error) {
    throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}

/**
 * complex callbacks documentation
 *
 */

/**
 * @typedef {Object} TalentAdapter
 * @property {getTalentReturn} getTalent function to get talent by id (instantied)
 * @property {createTalentReturn} createTalent function to generate talent (instantiated).
 * @property {updateTalentReturn} updateTalent function to update talent  (instantiated).
 * @property {deleteTalentReturn} deleteTalent function to delete talent (instantiated).
 * @property {matchTalentsFromOpeningReturn} matchTalentsFromOpening function to query  talents from matching (instantiated).
 */

/**
 * This callback is displayed as part of the createTalent function.
 * @memberof adapters
 * @callback createTalentReturn
 * @param {MutateTalentInputCreate | Talent} params input param for createTalent
 * @returns {Promise<Talent>} new report data
 */

/**
 * This callback is displayed as part of the updateTalent function.
 * @memberof adapters
 * @callback updateTalentReturn
 * @param {string} id id of the current data for update
 * @param {string} talentEconomicSegment partition key of the data
 * @param {MutateTalentInputUpdate} params input param for updateTalent
 * @returns {Promise<Talent>} new report data
 */

/**
 * This callback is displayed as part of the deleteTalent function.
 * @memberof adapters
 * @callback deleteTalentReturn
 * @param {string} id id of the current data for update
 * @param {string} talentEconomicSegment partition key of the data
 * @returns {Promise<Talent>} new report data
 */

/**
 * This callback is displayed as part of the getTalent function.
 * @memberof adapters
 * @callback getTalentReturn
 * @param {string} id key of the data
 * @param {string} talentEconomicSegment partition key of the data
 * @returns {Promise<Talent>} task from repository
 */

/**
 * This callback is displayed as part of the matchTalentsFromOpening function.
 * @memberof adapters
 * @callback matchTalentsFromOpeningReturn
 * @param {Opening} opening data to use in query
 * @returns {Promise<Array<Talent>>} task from repository
 */
