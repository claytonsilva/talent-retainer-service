
import { config as AWSConfigInstance, DynamoDB, SQS, SNS } from 'aws-sdk'
import { EPersistOperation } from '../../business/constants'
import { appConfig, AWSDynamoConfig, AWSSqsConfig, AWSConfig, AWSSnsConfig } from '../../config'
import { adapter } from '../../adapters'
import { handleLogger } from '../logger/logger'
import { databaseRepository, queueRepository, eventRepository } from '../state-machines'
import { map } from 'bluebird'
import R from 'ramda'

/**
 * Talents handler.
 * more about: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
 *
 * @memberof ports/aws-lambda
 * @param {*} event event object information from lambda (https://docs.aws.amazon.com/pt_br/lambda/latest/dg/with-s3.html)
 * @param {*} context information from direct call with params
 */
export const handler = async (event, context) => {
  const appName = 'talents-worker'
  const isProduction = process.env.ENV_NAME === 'production'
  const envName = isProduction ? 'production' : 'staging'

  console.log(event)

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

  const adapterInstance = adapter(escriba, talentRepoInstance, talentQueueRepoInstance, talentEventRepoInstance, openingRepoInstance, openingQueueRepoInstance, openingEventRepoInstance, EPersistOperation.ALL)

  const processEvent = async (data, adapterInstance) => {
    switch (data.operation) {
      case 'CREATE':
        return adapterInstance.talent.createTalent(data.payload)
      case 'UPDATE':
        return adapterInstance.talent.updateTalent(data.payload.id, data.payload.talentEconomicSegment, data.payload)
      case 'DELETE':
        return adapterInstance.talent.deleteTalent(data.payload.id, data.payload.talentEconomicSegment)
      case 'MATCH':
        // the match process occurs in opost repository
        return adapterInstance.opening.matchOpeningsFromTalent(data.payload)
      default:
        // the match process occurs in opost repository
        return adapterInstance.opening.matchOpeningsFromTalent(data.payload)
    }
  }

  if ((!R.isNil(event) && !R.isEmpty(event)) &&
    (!R.isNil(event.Records) && !R.isEmpty(event.Records)) &&
    (R.type(event.Records) === 'Array')) {
    const records = event.Records

    return map(records, async record => {
      try {
        const message = record.body
        const recordResponse = await processEvent(JSON.parse(message), adapterInstance)
        return { response: recordResponse, error: {} }
      } catch (error) {
        escriba.error('handler', error)
        // must propagate to fail lambda event
        throw error
      }
    }, { concurrency: 1 })
  }
}
