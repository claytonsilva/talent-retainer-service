/**
 * common functions in business validation
 */
import { not, is } from 'ramda'

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
