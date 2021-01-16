import { isNil } from 'ramda'

/**
   * @description Parse json encapsulated with verification
   * @memberof ports/aws-lambda
   * @function
   * @param {string} body json body "stringfied"
   * @returns {Object}
   */
export const getSafeBody = (body) => {
  if (isNil(body)) {
    return {}
  }

  return JSON.parse(body)
}

/**
   * @description Parse payload for response with api-gateway rules
   * @memberof business
   * @function
   * @param {string} body json body "stringfied"
   * @returns {Object}
   */
export const parseAPIGWResponse = (response, statusCode) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(response)
  }
}
