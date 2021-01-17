
import { config as AWSConfigInstance, DynamoDB, SQS } from 'aws-sdk'

import { appConfig, AWSDynamoConfig, AWSSqsConfig, AWSConfig } from '../../config'
import { adapter } from '../../adapters'
import { handleLogger } from '../logger/logger'
import { databaseRepository, queueRepository } from '../state-machines'
import { getSafeBody, parseAPIGWResponse } from './common'

/**
 * Openings handler.
 * more about: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
 *
 * @memberof ports/aws-lambda
 * @param {*} event event object information from lambda (https://docs.aws.amazon.com/pt_br/lambda/latest/dg/with-s3.html)
 * @param {*} context information from direct call with params
 */
export const handler = async (event, context) => {
  const appName = 'openings'
  const isProduction = process.env.ENV_NAME === 'production'
  const envName = isProduction ? 'production' : 'staging'

  // Escriba configuration.
  const escriba = handleLogger(appName, envName)

  // AWS configuration.
  AWSConfigInstance.update(AWSConfig)
  // AWS Dynamo configuration
  const dynamo = new DynamoDB.DocumentClient(AWSDynamoConfig)
  // AWS SQS configuration
  const sqs = new SQS(AWSSqsConfig)

  // inject repositories
  const talentRepoInstance = databaseRepository(dynamo, appConfig.talent.tableName)
  const openingRepoInstance = databaseRepository(dynamo, appConfig.opening.tableName)
  const talentQueueRepoInstance = queueRepository(sqs, appConfig.talent.queueUrl)
  const openingQueueRepoInstance = queueRepository(sqs, appConfig.opening.queueUrl)

  const adapterInstance = adapter(escriba, talentRepoInstance, talentQueueRepoInstance, openingRepoInstance, openingQueueRepoInstance, appConfig.persistOperation)

  const getOpening = async () => {
    try {
      const { id, segment } = event.pathParameters
      const result = await adapterInstance.opening.getOpening(id, segment)
      escriba.info('handler.get', `Get the opening: ${id}`)
      return parseAPIGWResponse(result, 200)
    } catch (error) {
      escriba.error('handler.get', { ...error })

      return parseAPIGWResponse(error, 400)
    }
  }

  const createOpening = async () => {
    try {
      const result = await adapterInstance.opening.createOpening(getSafeBody(event.body))
      escriba.info('handler.create', `Generated the opening: ${result.id}`, result)
      return parseAPIGWResponse(result, 201)
    } catch (error) {
      escriba.error('handler.create', { ...error })
      return parseAPIGWResponse(error, 400)
    }
  }

  const updateOpening = async () => {
    try {
      const { id, segment } = event.pathParameters
      const result = await adapterInstance.opening.updateOpening(id, segment, getSafeBody(event.body))
      escriba.info('handler.update', `Updated the opening: ${result.id}`, result)
      return parseAPIGWResponse(result, 200)
    } catch (error) {
      escriba.error('handler.update', { ...error })
      return parseAPIGWResponse(error, 400)
    }
  }

  const deleteOpening = async () => {
    try {
      const { id, segment } = event.pathParameters
      const result = await adapterInstance.opening.deleteOpening(id, segment)
      escriba.info('handler.delete', `Delete the opening: ${id}`)
      return parseAPIGWResponse(result, 200)
    } catch (error) {
      escriba.error('handler.delete', { ...error })
      return parseAPIGWResponse(error, 400)
    }
  }

  switch (event.requestContext.httpMethod) {
    case 'GET':
      return getOpening()
    case 'POST':
      return createOpening()
    case 'PUT':
      return updateOpening()
    case 'DELETE':
      return deleteOpening()
    default:
      return getOpening()
  }
}
