/**
 * route http ports  Namespace.
 * @namespace ports/http
 *
 *
 * @description this namespace is part of port http
 */

import express from 'express'
import bodyParser from 'body-parser'
import { config as AWSConfigInstance, DynamoDB, SQS, SNS } from 'aws-sdk'
import { databaseRepository, queueRepository, eventRepository } from '../state-machines'
import { adapter } from '../../adapters'
import { appConfig, AWSDynamoConfig, AWSSqsConfig, AWSConfig, AWSSnsConfig } from '../../config'
import { getRoutes } from './routes/index'
import { handleLogger } from '../logger'

// Setting app
const _app = express()

// Escriba
const escriba = handleLogger(appConfig.appName, appConfig.envName)

// AWS main configuration
AWSConfigInstance.update(AWSConfig)

// AWS Dynamo configuration.
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

_app.use(bodyParser.json({ limit: '50mb' }))
_app.use(bodyParser.urlencoded({ extended: false }))

export const app = getRoutes(escriba, adapterInstance, _app)
