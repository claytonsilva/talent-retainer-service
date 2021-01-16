// eslint-disable-next-line no-unused-vars
import { EOperation } from '../business/constants'
// eslint-disable-next-line no-unused-vars
import { sendMessageReturn } from '../ports/state-machines/aws.sqs'
// eslint-disable-next-line no-unused-vars
import { QueueRepositoryInstance } from '../ports/state-machines'

import {
  // eslint-disable-next-line no-unused-vars
  CustomError,
  EClassError,
  throwCustomError
} from '../utils'

/**
 * @description Send message to Queue for processing
 * @memberof adapters
 * @async
 * @function
 * @throws {CustomError}
 * @param {Logger} escriba instance of escriba
 * @param {QueueRepositoryInstance} queueRepository state-machine queue methods
 * @returns {sendPayloadtoQueueReturn} function to call createOpening direct
 */
export const sendPayloadtoQueue = (escriba, queueRepository) => async (payload, entityName, operation) => {
  const methodPath = 'adapters.common.sendPayloadtoQueue'
  try {
    const result = await queueRepository.sendMessage({
      operation,
      payload
    })

    escriba.info({
      action: 'SEND_PAYLOAD_TO_QUEUE',
      operation,
      entity: entityName,
      method: methodPath,
      queueResult: result,
      data: { payload }
    })

    return result
  } catch (error) {
    return throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}

/**
 * This callback is displayed as part of the createOpening function.
 * @memberof adapters
 * @callback sendPayloadtoQueueReturn
 * @param {Object} payload input param for createOpening
 * @param {string} entityName name of the entity to persist (log usage)
 * @param {EOperation} operation operation to process when worker run
 * @returns {Promise<sendMessageReturn>} new report data
 */
