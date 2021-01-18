/**
 * reference only imports (for documentation)
 */
// eslint-disable-next-line no-unused-vars
import { Opening, MutateOPeningInputCreate, MutateOPeningInputUpdate, Talent } from './index'
/**
 * code imports
 */
import { v4 as uuidv4 } from 'uuid'
import { toISOString } from './moment'
import { ETalentRangeSalary, EOpeningStatus } from './constants'
import { validateInnerArrayString, reduceContains } from './common'
import R from 'ramda'
import {
  EClassError,
  throwCustomError,
  // eslint-disable-next-line no-unused-vars
  CustomError
} from '../utils'

/**
 * @description Validate a Opening event on creation
 * @memberof business
 * @function
 * @throws {CustomError}
 * @param {MutateOPeningInputCreate} data imput data for create opening
 * @returns {Opening}
 */
export const validateCreateOpening = (data) => {
  const creationDate = toISOString()
  const methodPath = 'business.opening.validateCreateOpening'

  if (R.isEmpty(data) || R.isNil(data)) {
    throwCustomError(new Error('invalid entry on field data, missing information'), methodPath, EClassError.USER_ERROR)
  }

  if (R.isEmpty(data.openingEconomicSegment) || R.isNil(data.openingEconomicSegment)) {
    throwCustomError(new Error('invalid entry on field data, missing information about openingEconomicSegment'), methodPath, EClassError.USER_ERROR)
  }

  if (R.isEmpty(data.openingCompanyName) || R.isNil(data.openingCompanyName)) {
    throwCustomError(new Error('invalid entry on field data, missing information about openingCompanyName'), methodPath, EClassError.USER_ERROR)
  }

  if (R.isEmpty(data.openingJobName) || R.isNil(data.openingJobName)) {
    throwCustomError(new Error('invalid entry on field data, missing information about openingJobName'), methodPath, EClassError.USER_ERROR)
  }

  if (R.not(validateInnerArrayString(data.openingHardSkillsTags))) {
    throwCustomError(new Error(`invalid value for openingHardSkillsTags`), methodPath, EClassError.USER_ERROR)
  }

  if (R.not(validateInnerArrayString(data.openingSoftSkillsTags))) {
    throwCustomError(new Error(`invalid value for openingSoftSkillsTags`), methodPath, EClassError.USER_ERROR)
  }

  if (R.not(validateInnerArrayString(data.openingPositionTags))) {
    throwCustomError(new Error(`invalid value for openingPositionTags`), methodPath, EClassError.USER_ERROR)
  }

  if ((R.not(R.isNil(data.openingStatus)) && R.not(Object.values(EOpeningStatus).includes(data.openingStatus)))) {
    throwCustomError(new Error(`invalid value for openingStatus: got ${data.openingStatus}`), methodPath, EClassError.USER_ERROR)
  }

  if ((R.not(R.isNil(data.openingRangeSalary)) && R.not(Object.values(ETalentRangeSalary).includes(data.openingRangeSalary)))) {
    throwCustomError(new Error(`invalid value for openingRangeSalary: got ${data.openingRangeSalary}`), methodPath, EClassError.USER_ERROR)
  }

  return {
    // information from system
    creationDate,
    id: uuidv4(),
    // default values if is missing
    openingStatus: EOpeningStatus.OPEN,
    openingSalaryRange: ETalentRangeSalary.NONE,
    openingResume: '-',
    ...data
  }
}

/**
   * @description Validate a Opening event on update
   * @memberof business
   * @function
   * @throws {CustomError}
   * @param {MutateOPeningInputUpdate} data update opening input
   * @param {Opening} originalData current opening data
   * @returns {Opening}
   */
export const validateUpdateOpening = (data, originalData) => {
  const lastUpdateDate = toISOString()
  const methodPath = 'business.opening.validateUpdateOpening'

  if (R.isNil(originalData)) {
    throwCustomError(new Error('no data for this id'), methodPath, EClassError.USER_ERROR)
  }

  if (R.isEmpty(data) || R.isNil(data)) {
    throwCustomError(new Error('invalid entry on field data, missing information'), methodPath, EClassError.USER_ERROR)
  }

  if (R.isEmpty(data.openingCompanyName) || R.isNil(data.openingCompanyName)) {
    throwCustomError(new Error('invalid entry on field data, missing information about openingCompanyName'), methodPath, EClassError.USER_ERROR)
  }

  if (R.isEmpty(data.openingJobName) || R.isNil(data.openingJobName)) {
    throwCustomError(new Error('invalid entry on field data, missing information about openingJobName'), methodPath, EClassError.USER_ERROR)
  }

  if (R.not(validateInnerArrayString(data.openingHardSkillsTags))) {
    throwCustomError(new Error(`invalid value for openingHardSkillsTags`), methodPath, EClassError.USER_ERROR)
  }

  if (R.not(validateInnerArrayString(data.openingSoftSkillsTags))) {
    throwCustomError(new Error(`invalid value for openingSoftSkillsTags`), methodPath, EClassError.USER_ERROR)
  }

  if (R.not(validateInnerArrayString(data.openingPositionTags))) {
    throwCustomError(new Error(`invalid value for openingPositionTags`), methodPath, EClassError.USER_ERROR)
  }

  if ((R.not(R.isNil(data.openingStatus)) && R.not(Object.values(EOpeningStatus).includes(data.openingStatus)))) {
    throwCustomError(new Error(`invalid value for openingStatus: got ${data.openingStatus}`), methodPath, EClassError.USER_ERROR)
  }

  if ((R.not(R.isNil(data.openingRangeSalary)) && R.not(Object.values(ETalentRangeSalary).includes(data.openingRangeSalary)))) {
    throwCustomError(new Error(`invalid value for openingRangeSalary: got ${data.openingRangeSalary}`), methodPath, EClassError.USER_ERROR)
  }

  return ['id', 'creationDate', 'openingEconomicSegment']
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
   * @description Validate a Opening event on delete
   * @memberof business
   * @function
   * @throws {CustomError}
   * @param {Opening} originalData current opening data
   * @returns {Opening}
   */
export const validateDeleteOpening = (originalData) => {
  const methodPath = 'business.opening.validateDeleteOpening'
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
 * @param {Talent} talent talent to filter in openings base
 * @returns {FilterExpressionObject}
 */
export const generateFilterExpression = (talent) => {
  const contains = talent.talentHardSkillsTags.reduce(reduceContains('openingHardSkillsTags'),
    talent.talentSoftSkillsTags.reduce(reduceContains('openingSoftSkillsTags'),
      talent.talentPositionTags.reduce(reduceContains('openingPositionTags'), {
        expression: '',
        value: {}
      })
    )
  )

  const containsExpression = R.isEmpty(contains.expression) ? '' : `AND (${contains.expression})`

  return {
    keyConditionExpression: `openingEconomicSegment = :openingEconomicSegment`,
    filterExpression: ` openingStatus = :${EOpeningStatus.OPEN}
  ${containsExpression}`,
    expressionAttributeValuesQuery: R.assoc(`:${EOpeningStatus.OPEN}`, EOpeningStatus.OPEN,
      {
        ':openingEconomicSegment': talent.talentEconomicSegment,
        ...contains.value
      }
    )
  }
}

/**
 * @typedef {Object} FilterExpressionObject
 * @property {string} keyConditionExpression keys for filter inner hash key
 * @property {string} filterExpression  advanced filter expression inner hash filtered values
 * @property {Object} expressionAttributeValuesQuery  values from filter
 */
