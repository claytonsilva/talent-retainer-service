/**
 * common functions in business validation
 */
import { not, is, isEmpty, assoc } from 'ramda'

/**
   * @description Validate if all objects in the array have same type of the argument
   * @memberof business
   * @function
   * @param {Array} data array of the elements
   * @returns {boolean}
   */
export const validateInnerArrayString = (data) => {
  if (!Array.isArray(data)) {
    return false
  }

  return not(data.some(tag => not(is(String, tag))))
}

/**
   * @description Reduce array of tags in a query for usage with match method in opening/talent business
   * @memberof business
   * @function
   * @param {Array} data array of the elements
   * @returns {boolean}
   */
export const reduceContains = (fieldName) => (acc, tag, index) => {
  // first or condition
  return {
    expression: acc.expression + `${isEmpty(acc.expression) ? '' : '\n        OR'} contains(${fieldName}, :${fieldName}${index})`,
    value: assoc(`:${fieldName}${index}`, tag, acc.value)
  }
}
