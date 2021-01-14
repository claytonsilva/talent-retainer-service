/**
 * Reference only imports (for documentation)
*/

// eslint-disable-next-line no-unused-vars
import { Logger } from 'log4js'
// eslint-disable-next-line no-unused-vars
import { DynamoRepositoryInstance } from '../ports/state-machines'
// eslint-disable-next-line no-unused-vars
import { MutateOpeningInputCreate, MutateOpeningInputUpdate, Opening, OpeningKey } from '../business'

/**
 * code imports
 */

import {
  // eslint-disable-next-line no-unused-vars
  CustomError,
  EClassError,
  throwCustomError
} from '../utils'

import { validateUpdateOpening, validateCreateOpening, validateDeleteOpening } from '../business/opening'

/**
 * @description Talent adapter factory
 * @memberof adapters
 * @function
 * @param {Logger} escriba instance of escriba logger
 * @param {DynamoRepositoryInstance} repository state-machine database methods
 * @returns {OpeningAdapter} Talent adapter instantied
 */
const openingAdapterFactory = (escriba, repository) => ({
  getOpening: getOpening(repository),
  createOpening: createOpening(escriba, repository),
  updateOpening: updateOpening(escriba, repository),
  deleteOpening: deleteOpening(escriba, repository)
})

export default openingAdapterFactory

/**
 * @description Handler function to get Talent data by id .
 * @memberof adapters
 * @async
 * @function
 * @throws {CustomError}
 * @param {DynamoRepositoryInstance} repository - State-machine database methods.
 * @returns {getOpeningReturn} GetDocument method ready to execute.
 */
const getOpening = (repository) => async (id, openingEconomicSegment) => {
  const methodPath = 'adapters.opening.getOpening'
  try {
    return await repository.getDocument({ id, openingEconomicSegment })
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
 * @returns {createOpeningReturn} function to call createOpening direct
 */
const createOpening = (escriba, repository) => async (params) => {
  const methodPath = 'adapters.opening.createOpening'
  try {
    const documentInserted = await repository
      .putDocument(
        validateCreateOpening(
          params
        )
      )

    escriba.info({
      action: 'OPENING_CREATED',
      method: methodPath,
      data: { documentInserted }
    })

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
 * @returns {updateOpeningReturn} function to call updateOpening direct
 */
const updateOpening = (escriba, repository) => async (id, openingEconomicSegment, params) => {
  const methodPath = 'adapters.opening.updateOpening'
  try {
    const currObject = await getOpening(repository)(id, openingEconomicSegment)

    const ExpressionAttributeValues = validateUpdateOpening(params, currObject)

    const UpdateExpression = `
    set openingCompanyName = :openingCompanyName,
        openingJobName = :openingJobName,
        openingResume = :openingResume,
        openingSoftSkillsTags = :openingSoftSkillsTags,
        openingHardSkillsTags = :openingHardSkillsTags,
        openingPositionTags = :openingPositionTags,
        openingStatus = :openingStatus,
        openingRangeSalary = :openingRangeSalary
    `

    // send report to existing Talent previous created
    const task = await repository.updateDocument(
      { id, openingEconomicSegment },
      UpdateExpression,
      ExpressionAttributeValues
    )

    // log report data
    escriba.info({
      action: 'OPENING_UPDATED',
      method: methodPath,
      data: task
    })

    // return updated item
    return task
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
 * @returns {deleteOpeningReturn} function to call deleteOpening direct
 */
const deleteOpening = (escriba, repository) => async (id, openingEconomicSegment) => {
  const methodPath = 'adapters.opening.deleteOpening'
  try {
    const currObject = validateDeleteOpening(await getOpening(repository)(id, openingEconomicSegment))
    await repository.deleteDocument({ id, openingEconomicSegment })

    // log report data
    escriba.info({
      action: 'OPENING_DELETED',
      method: methodPath,
      data: currObject
    })

    return currObject
  } catch (error) {
    throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}

/**
 * complex callbacks documentation
 *
 */

/**
 * @typedef {Object} OpeningAdapter
 * @property {getOpeningReturn} getOpening function to get opening by id (instantied)
 * @property {createOpeningReturn} createOpening function to generate opening (instantiated).
 * @property {updateOpeningReturn} updateOpening function to update opening  (instantiated).
 * @property {deleteOpeningReturn} deleteOpening function to delete opening (instantiated).
 */

/**
 * This callback is displayed as part of the createOpening function.
 * @memberof adapters
 * @callback createOpeningReturn
 * @param {MutateOpeningInputCreate} params input param for createOpening
 * @returns {Promise<Opening>} new report data
 */

/**
 * This callback is displayed as part of the updateOpening function.
 * @memberof adapters
 * @callback updateOpeningReturn
 * @param {string} id id of the current data for update
 * @param {string} openingEconomicSegment partition key of the data
 * @param {MutateOpeningInputUpdate} params input param for updateOpening
 * @returns {Promise<Opening>} new report data
 */

/**
 * This callback is displayed as part of the deleteOpening function.
 * @memberof adapters
 * @callback deleteOpeningReturn
 * @param {string} id id of the current data for update
 * @param {string} openingEconomicSegment partition key of the data
 * @returns {Promise<Opening>} new report data
 */

/**
 * This callback is displayed as part of the getOpening function.
 * @memberof adapters
 * @callback getOpeningReturn
 * @param {string} id key of the data
 * @param {string} openingEconomicSegment partition key of the data
 * @returns {Promise<Opening>} task from repository
 */
