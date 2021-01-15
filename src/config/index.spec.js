import { AWSConfig, AWSDynamoConfig, AWSS3Config, AWSSqsConfig, appConfig, momentConfig, escribaConf, envProdName } from './index'

describe('config', () => {
  test('AWSConfig', () => {
    expect(AWSConfig).toHaveProperty('accessKeyId')
    expect(AWSConfig).toHaveProperty('secretAccessKey')
    expect(AWSConfig).toHaveProperty('region')
    expect(AWSConfig).toHaveProperty('profile')
  })
  test('AWSDynamoConfig', () => {
    expect(AWSDynamoConfig).toHaveProperty('region')
    expect(AWSDynamoConfig).toHaveProperty('apiVersion', '2012-08-10')
    expect(AWSDynamoConfig).toHaveProperty('endpoint')
  })
  test('AWSS3Config', () => {
    expect(AWSS3Config).toHaveProperty('region')
    expect(AWSS3Config).toHaveProperty('apiVersion', '2006-03-01')
  })
  test('AWSSqsConfig', () => {
    expect(AWSSqsConfig).toHaveProperty('region')
    expect(AWSSqsConfig).toHaveProperty('apiVersion', '2012-11-05')
  })
  test('momentConfig', () => {
    expect(momentConfig).toHaveProperty('timezone', 'America/Sao_Paulo')
  })
  test('envProdName', () => {
    expect(envProdName).toBe('production')
  })
  test('appConfig', () => {
    expect(appConfig).toHaveProperty('appName', 'talent-retainer-service')
    expect(appConfig).toHaveProperty('isProduction', false)
    expect(appConfig.isProduction).not.toBeUndefined()
    expect(appConfig.isProduction).not.toBeNull()
    expect(appConfig).toHaveProperty('envName', 'test')
    expect(appConfig).toHaveProperty('talent')
    expect(appConfig).toHaveProperty('opening')
    expect(appConfig.talent).toHaveProperty('tableName', 'talent')
    expect(appConfig.talent).toHaveProperty('queueUrl', 'talent')
    expect(appConfig.opening).toHaveProperty('tableName', 'opening')
    expect(appConfig.opening).toHaveProperty('queueUrl', 'opening')
  })
  test('escribaConf', () => {
    expect(escribaConf).toHaveProperty('log4jsConf')
    expect(escribaConf.log4jsConf).toHaveProperty('appenders')
    expect(escribaConf.log4jsConf.appenders).toHaveProperty('out', {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '[%d] %m'
      }
    })
    expect(escribaConf.log4jsConf.categories).toHaveProperty('default', {
      appenders: [
        'out'
      ],
      level: 'info'
    })
    expect(escribaConf).toHaveProperty('sensitiveConf')
    expect(escribaConf.sensitiveConf).toHaveProperty('password', {
      paths: ['message.password'],
      pattern: /\w.*/g,
      replacer: '*'
    })
  })
})
