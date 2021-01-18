/**
 * Reference only imports (for documentation).
 */
// eslint-disable-next-line no-unused-vars
import { SNS } from 'aws-sdk'
/**
 * Code imports.
 */
import { classError } from './constants'
import { throwCustomError } from '../../utils'

/**
 * AWS SNS custom methods.
 *
 */

/**
 * @description Send the message to sns.
 * @memberof ports/state-machines
 * @async
 * @function
 * @throws {CustomError}
 * @param {SNS} sns instance of SNS sdk from aws.
 * @param {string} topicArn arn from SNS topic.
 * @returns {publishMessageReturn}
 */
export const publishMessage = (sns, topicArn) => async (subject, body) => {
  const methodPath = 'ports.state-machines.aws.sns.publishMessage'
  try {
    const params = {
      TopicArn: topicArn,
      Subject: subject,
      Message: JSON.stringify(body)
    }
    const result = await sns.publish(params).promise()

    if (typeof result.MessageId === 'undefined') {
      throw new Error('No message id response!')
    }

    return result
  } catch (rejectResponse) {
    if (rejectResponse instanceof Error) {
      throwCustomError(rejectResponse, methodPath, classError.INTERNAL)
    } else {
      throwCustomError(new Error(`${rejectResponse.$response.error.code}: ${rejectResponse.$response.error.message}`), methodPath, classError.INTERNAL)
    }
  }
}

/**
 * exclusive specifications docs for complex types
 */

/**
 * This callback is displayed as part of the sendMessage function.
 *
 * @callback publishMessageReturn
 * @param {Object} body  body of message
 * @param {string} subject subject of the event
 * @returns {Promise<SNS.Types.PublishResponse>} response from aws
 */
