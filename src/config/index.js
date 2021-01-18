/**
 * config  Namespace.
 * @namespace config
 *
 *
 * @description this namespace is a configuration of the project
 */
// eslint-disable-next-line no-unused-vars
import { Configuration as Log4jsConf } from 'log4js'

// code imports
import R from 'ramda'
import { getEnv } from './environments'

/**
 * general aws configuration
 * @memberof config
 */
const AWSConfig = {
  accessKeyId: getEnv('AWS_ACCESS_KEY_ID'),
  secretAccessKey: getEnv('AWS_ACCESS_SECRET_KEY'),
  region: getEnv('AWS_REGION'),
  profile: getEnv('AWS_PROFILE')
}

/**
 * aws dynamodb configuration
 * @memberof config
 */
const AWSDynamoConfig = R.merge(
  AWSConfig,
  {
    region: getEnv('AWS_DYNAMO_REGION'),
    apiVersion: getEnv('AWS_DYNAMO_APIVERSION', '2012-08-10'),
    endpoint: getEnv('AWS_DYNAMO_ENDPOINT')
  }
)

/**
 * aws sqs configuration
 * @memberof config
 */
const AWSSqsConfig = R.merge(
  AWSConfig,
  {
    region: getEnv('AWS_SQS_REGION', 'us-west-2'),
    apiVersion: getEnv('AWS_SQS_APIVERSION', '2012-11-05')
  }
)

/**
 * aws sns configuration
 * @memberof config
 */
const AWSSnsConfig = R.merge(
  AWSConfig,
  {
    region: getEnv('AWS_SNS_REGION'),
    apiVersion: getEnv('AWS_SNS_APIVERSION', '2010-03-31'),
    endpoint: getEnv('AWS_SNS_ENDPOINT')
  }
)

/**
 * aws s3 configuration
 * @memberof config
 */
const AWSS3Config = R.merge(
  AWSConfig,
  {
    region: getEnv('AWS_SQS_REGION', 'us-west-2'),
    apiVersion: getEnv('AWS_S3_APIVERSION', '2006-03-01')
  }
)

/**
 * moment configuration
 * @memberof config
 */
const momentConfig = {
  timezone: getEnv('TIMEZONE', 'America/Sao_Paulo')
}

const envProdName = 'production'

/**
 * general application configuration
 * @memberof config
 */
const appConfig = {
  appName: getEnv('APP_NAME', 'talent-retainer-service'),
  isProduction: getEnv('NODE_ENV') === envProdName,
  persistOperation: getEnv('WRITE_OPERATION_LEVEL', 'ALL'),
  envName: getEnv('NODE_ENV'),
  talent: {
    tableName: getEnv('AWS_DYNAMO_TALENT_TABLE_NAME', 'talent'),
    queueUrl: getEnv('AWS_SQS_TALENT_QUEUE_URL', 'talent'),
    topicArn: getEnv('AWS_SNS_TALENT_TOPIC_ARN', 'talent')

  },
  opening: {
    tableName: getEnv('AWS_DYNAMO_OPENING_TABLE_NAME', 'opening'),
    queueUrl: getEnv('AWS_SQS_OPENING_QUEUE_URL', 'opening'),
    topicArn: getEnv('AWS_SNS_OPENING_TOPIC_ARN', 'opening')
  }
}

/**
 * logger configuration fixed for all jobs
 * @memberof config
 */
const escribaConf = {
  sensitiveConf: {
    password: {
      paths: ['message.password'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  },
  log4jsConf: {
    appenders: {
      out: {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: '[%d] %m'
        }
      }
    },
    categories: {
      default: {
        appenders: [
          'out'
        ],
        level: 'info'
      }
    }
  }
}

export {
  appConfig,
  AWSConfig,
  AWSDynamoConfig,
  AWSS3Config,
  AWSSqsConfig,
  AWSSnsConfig,
  escribaConf,
  envProdName,
  momentConfig
}
