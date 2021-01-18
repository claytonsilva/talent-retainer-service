/**
 * reference only imports (for documentation)
 */
// eslint-disable-next-line no-unused-vars
import { Talent, MutateTalentInputCreate, MutateTalentInputUpdate, Opening } from './index'
/**
 * code imports
 */
import { v4 as uuidv4 } from 'uuid'
import { toISOString } from './moment'
import { ETalentRangeSalary, ETalentStatus } from './constants'
import { validateInnerArrayString, reduceContains } from './common'
import R from 'ramda'
import {
  EClassError,
  throwCustomError,
  // eslint-disable-next-line no-unused-vars
  CustomError
} from '../utils'

/**
 * @description Validate a Talent event on creation
 * @memberof business
 * @function
 * @throws {CustomError}
 * @param {MutateTalentInputCreate} data imput data for create talent
 * @returns {Talent}
 */
export const validateCreateTalent = (data) => {
  const creationDate = toISOString()
  const methodPath = 'business.talent.validateCreateTalent'

  if (R.isEmpty(data) || R.isNil(data)) {
    throwCustomError(new Error('invalid entry on field data, missing information'), methodPath, EClassError.USER_ERROR)
  }

  if (R.isEmpty(data.talentEconomicSegment) || R.isNil(data.talentEconomicSegment)) {
    throwCustomError(new Error('invalid entry on field data, missing information about talentEconomicSegment'), methodPath, EClassError.USER_ERROR)
  }

  if (R.isEmpty(data.talentName) || R.isNil(data.talentName)) {
    throwCustomError(new Error('invalid entry on field data, missing information about talentName'), methodPath, EClassError.USER_ERROR)
  }

  if (R.isEmpty(data.talentSurname) || R.isNil(data.talentSurname)) {
    throwCustomError(new Error('invalid entry on field data, missing information about talentSurname'), methodPath, EClassError.USER_ERROR)
  }

  if (R.not(validateInnerArrayString(data.talentHardSkillsTags))) {
    throwCustomError(new Error(`invalid value for talentHardSkillsTags`), methodPath, EClassError.USER_ERROR)
  }

  if (R.not(validateInnerArrayString(data.talentSoftSkillsTags))) {
    throwCustomError(new Error(`invalid value for talentSoftSkillsTags`), methodPath, EClassError.USER_ERROR)
  }

  if (R.not(validateInnerArrayString(data.talentPositionTags))) {
    throwCustomError(new Error(`invalid value for talentPositionTags`), methodPath, EClassError.USER_ERROR)
  }

  if ((R.not(R.isNil(data.talentStatus)) && R.not(Object.values(ETalentStatus).includes(data.talentStatus)))) {
    throwCustomError(new Error(`invalid value for talentStatus: got ${data.talentStatus}`), methodPath, EClassError.USER_ERROR)
  }

  if ((R.not(R.isNil(data.talentLastSalaryRange)) && R.not(Object.values(ETalentRangeSalary).includes(data.talentLastSalaryRange)))) {
    throwCustomError(new Error(`invalid value for talentLastSalaryRange: got ${data.talentLastSalaryRange}`), methodPath, EClassError.USER_ERROR)
  }

  return {
    // information from system
    id: uuidv4(),
    creationDate,
    // default values if is missing
    talentStatus: ETalentStatus.OPEN,
    talentLastSalaryRange: ETalentRangeSalary.NONE,
    talentResume: '-',
    ...data
  }
}

/**
   * @description Validate a Talent event on update
   * @memberof business
   * @function
   * @throws {CustomError}
   * @param {MutateTalentInputUpdate} data update talent input
   * @param {Talent} originalData current talent data
   * @returns {Talent}
   */
export const validateUpdateTalent = (data, originalData) => {
  const lastUpdateDate = toISOString()
  const methodPath = 'business.talent.validateUpdateTalent'

  if (R.isNil(originalData)) {
    throwCustomError(new Error('no data for this id'), methodPath, EClassError.USER_ERROR)
  }

  if (R.isEmpty(data) || R.isNil(data)) {
    throwCustomError(new Error('invalid entry on field data, missing information'), methodPath, EClassError.USER_ERROR)
  }

  if (R.isEmpty(data.talentName) || R.isNil(data.talentName)) {
    throwCustomError(new Error('invalid entry on field data, missing information about talentName'), methodPath, EClassError.USER_ERROR)
  }

  if (R.isEmpty(data.talentSurname) || R.isNil(data.talentSurname)) {
    throwCustomError(new Error('invalid entry on field data, missing information about talentSurname'), methodPath, EClassError.USER_ERROR)
  }

  if (R.not(validateInnerArrayString(data.talentHardSkillsTags))) {
    throwCustomError(new Error(`invalid value for talentHardSkillsTags`), methodPath, EClassError.USER_ERROR)
  }

  if (R.not(validateInnerArrayString(data.talentSoftSkillsTags))) {
    throwCustomError(new Error(`invalid value for talentSoftSkillsTags`), methodPath, EClassError.USER_ERROR)
  }

  if (R.not(validateInnerArrayString(data.talentPositionTags))) {
    throwCustomError(new Error(`invalid value for talentPositionTags`), methodPath, EClassError.USER_ERROR)
  }

  if ((R.not(R.isNil(data.talentStatus)) && R.not(Object.values(ETalentStatus).includes(data.talentStatus)))) {
    throwCustomError(new Error(`invalid value for talentStatus: got ${data.talentStatus}`), methodPath, EClassError.USER_ERROR)
  }

  if ((R.not(R.isNil(data.talentLastSalaryRange)) && R.not(Object.values(ETalentRangeSalary).includes(data.talentLastSalaryRange)))) {
    throwCustomError(new Error(`invalid value for talentLastSalaryRange: got ${data.talentLastSalaryRange}`), methodPath, EClassError.USER_ERROR)
  }

  return ['id', 'creationDate', 'talentEconomicSegment']
    .reduce(
      (reducedData, field) => R.dissoc(field, reducedData),
      {
        lastUpdateDate,
        ...originalData,
        ...data
      }
    )
}

/**
   * @description Validate a Talent event on delete
   * @memberof business
   * @function
   * @throws {CustomError}
   * @param {Talent} originalData current talent data
   * @returns {Talent}
   */
export const validateDeleteTalent = (originalData) => {
  const methodPath = 'business.talent.validateDeleteTalent'
  if (R.isNil(originalData)) {
    throwCustomError(new Error('no data for this id'), methodPath, EClassError.USER_ERROR)
  }

  return originalData
}

/**
   * @description Generate FilterExpression based on entry data for query
   * @memberof business
   * @function
   * @throws {CustomError}
   * @param {Opening} opening opening to filter in talents base
   * @returns {FilterExpressionObject}
   */
export const generateFilterExpression = (opening) => {
  const contains = opening.openingHardSkillsTags.reduce(reduceContains('talentHardSkillsTags'),
    opening.openingSoftSkillsTags.reduce(reduceContains('talentSoftSkillsTags'),
      opening.openingPositionTags.reduce(reduceContains('talentPositionTags'), {
        expression: '',
        value: {}
      })
    )
  )

  const containsExpression = R.isEmpty(contains.expression) ? '' : `AND (${contains.expression})`

  return {
    keyConditionExpression: `talentEconomicSegment = :talentEconomicSegment`,
    filterExpression: ` talentStatus in (:${ETalentStatus.OPEN}, :${ETalentStatus.LOOKING})
  ${containsExpression}`,
    expressionAttributeValuesQuery: R.assoc(`:${ETalentStatus.OPEN}`, ETalentStatus.OPEN,
      R.assoc(`:${ETalentStatus.LOOKING}`, ETalentStatus.LOOKING, {
        ':talentEconomicSegment': opening.openingEconomicSegment,
        ...contains.value
      })
    )
  }
}

/**
 * @typedef {Object} FilterExpressionObject
 * @property {string} keyConditionExpression keys for filter inner hash key
 * @property {string} filterExpression  advanced filter expression inner hash filtered values
 * @property {Object} expressionAttributeValuesQuery  values from filter
 */
