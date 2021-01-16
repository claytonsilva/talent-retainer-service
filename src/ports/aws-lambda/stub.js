import { handleLogger } from '../logger/logger'

/**
 * Talents handler.
 * more about: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
 *
 * @memberof ports/aws/lambda
 * @param {*} event event object information from lambda (https://docs.aws.amazon.com/pt_br/lambda/latest/dg/with-s3.html)
 * @param {*} context information from direct call with params
 */
export const handler = async (event, context) => {
  const appName = 'stub'
  const isProduction = process.env.ENV_NAME === 'production'
  const envName = isProduction ? 'production' : 'staging'

  // Escriba configuration.
  const escriba = handleLogger(appName, envName)

  escriba.info(event)

  return Promise.resolve({
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
}
