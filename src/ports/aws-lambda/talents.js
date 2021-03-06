
import { config as AWSConfigInstance, DynamoDB, SQS, SNS } from 'aws-sdk'

import { appConfig, AWSDynamoConfig, AWSSqsConfig, AWSConfig, AWSSnsConfig } from '../../config'
import { adapter } from '../../adapters'
import { handleLogger } from '../logger/logger'
import { databaseRepository, queueRepository, eventRepository } from '../state-machines'
import { getSafeBody, parseAPIGWResponse } from './common'

/**
 * Talents handler.
 * more about: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
 *
 * @memberof ports/aws-lambda
 * @param {*} event event object information from lambda (https://docs.aws.amazon.com/pt_br/lambda/latest/dg/with-s3.html)
 * @param {*} context information from direct call with params
 */
export const handler = async (event, context) => {
  const appName = 'talents'
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

  // AWS SNS configuration
  const sns = new SNS(AWSSnsConfig)

  // inject repositories
  const talentRepoInstance = databaseRepository(dynamo, appConfig.talent.tableName)
  const openingRepoInstance = databaseRepository(dynamo, appConfig.opening.tableName)
  const talentQueueRepoInstance = queueRepository(sqs, appConfig.talent.queueUrl)
  const openingQueueRepoInstance = queueRepository(sqs, appConfig.opening.queueUrl)
  const talentEventRepoInstance = eventRepository(sns, appConfig.talent.topicArn)
  const openingEventRepoInstance = eventRepository(sns, appConfig.opening.topicArn)

  const adapterInstance = adapter(escriba, talentRepoInstance, talentQueueRepoInstance, talentEventRepoInstance, openingRepoInstance, openingQueueRepoInstance, openingEventRepoInstance, appConfig.persistOperation)

  const getTalent = async () => {
    try {
      const { id, segment } = event.pathParameters
      const result = await adapterInstance.talent.getTalent(id, segment)
      escriba.info('handler.get', `Get the talent: ${id}`)
      return parseAPIGWResponse(result, 200)
    } catch (error) {
      escriba.error('handler.get', { ...error })

      return parseAPIGWResponse(error, 400)
    }
  }

  const createTalent = async () => {
    try {
      const result = await adapterInstance.talent.createTalent(getSafeBody(event.body))
      escriba.info('handler.create', `Generated the talent: ${result.id}`, result)
      return parseAPIGWResponse(result, 201)
    } catch (error) {
      escriba.error('handler.create', { ...error })
      return parseAPIGWResponse(error, 400)
    }
  }

  const updateTalent = async () => {
    try {
      const { id, segment } = event.pathParameters
      const result = await adapterInstance.talent.updateTalent(id, segment, getSafeBody(event.body))
      escriba.info('handler.update', `Updated the talent: ${result.id}`, result)
      return parseAPIGWResponse(result, 200)
    } catch (error) {
      escriba.error('handler.update', { ...error })
      return parseAPIGWResponse(error, 400)
    }
  }

  const deleteTalent = async () => {
    try {
      const { id, segment } = event.pathParameters
      const result = await adapterInstance.talent.deleteTalent(id, segment)
      escriba.info('handler.delete', `Delete the talent: ${id}`)
      return parseAPIGWResponse(result, 200)
    } catch (error) {
      escriba.error('handler.delete', { ...error })
      return parseAPIGWResponse(error, 400)
    }
  }

  switch (event.requestContext.httpMethod) {
    case 'GET':
      return getTalent()
    case 'POST':
      return createTalent()
    case 'PUT':
      return updateTalent()
    case 'DELETE':
      return deleteTalent()
    default:
      return getTalent()
  }
}
