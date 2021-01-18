import R from 'ramda'
/**
 * Printer handler for sns (to debug).
 * more about: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
 *
 * @memberof ports/aws/lambda
 * @param {*} event event object information from lambda (https://docs.aws.amazon.com/pt_br/lambda/latest/dg/with-s3.html)
 * @param {*} context information from direct call with params
 */
export const handler = async (event, context) => {
  const appName = 'sns-printer'

  if ((!R.isNil(event) && !R.isEmpty(event)) &&
    (!R.isNil(event.Records) && !R.isEmpty(event.Records)) &&
    (R.type(event.Records) === 'Array')) {
    /**
       * @constant
       * @type {[Object]}
      */
    const records = event.Records

    records.forEach((record) => {
      console.log('-------------------')
      console.log(`from ${appName}`)
      const matches = JSON.parse(JSON.parse(record.Sns.Message))
      matches.forEach((match) => {
        console.log(match)
      })
      console.log('-------------------')
    })

    return records
  }

  return null
}
