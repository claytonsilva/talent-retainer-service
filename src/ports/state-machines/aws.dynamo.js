/**
 * Reference only imports (for documentation).
 */
// eslint-disable-next-line no-unused-vars
import { DynamoDB } from 'aws-sdk'

/**
 * Code imports.
 */
import { classError } from './constants'
import { throwCustomError } from '../../utils'
import R from 'ramda'
/**
 * AWS DynamoDB custom methods.
 */

/**
 * Get a document on table TableName in the DynamoDB.
 *
 * @memberof ports/state-machines
 * @async
 * @function
 * @throws {CustomError}
 * @param {DynamoDB.DocumentClient} dynamo instance of Dynamo SDK for aws (DocumentClient)
 * @param {string} tableName name of table in DynamoDB
 * @returns {getDocumentReturn} Object searched from table
 */
export const getDocument = (dynamo, tableName) => async (key) => {
  try {
    const params = {
      TableName: tableName,
      Key: key
    }

    const result = await dynamo.get(params).promise()

    return (R.not(R.isEmpty(result)) && R.not(R.isNil(result)) && R.not(R.isNil(result.Item))) ? result.Item : null
  } catch (error) {
    throwCustomError(error, 'state-machines.aws.dynamo.getDocument', classError.INTERNAL)
  }
}

/**
 * Insert document in the DynamoDB.
 *
 * @memberof ports/state-machines
 * @async
 * @function
 * @throws {CustomError}
 * @param {DynamoDB.DocumentClient} dynamo instance of Dynamo SDK for aws (DocumentClient)
 * @param {string} tableName name of table in DynamoDB
 * @returns {putDocumentReturn} Object searched from table
 */
export const putDocument = (dynamo, tableName) => async (item) => {
  try {
    const params = {
      TableName: tableName,
      Item: item
    }
    await dynamo.put(params).promise()

    return params.Item
  } catch (error) {
    throwCustomError(error, 'state-machines.aws.dynamo.putDocument', classError.INTERNAL)
  }
}

/**
 * Update document in the DynamoDB.
 *
 * @memberof ports/state-machines
 * @async
 * @function
 * @throws {CustomError}
 * @param {DynamoDB.DocumentClient} dynamo instance of Dynamo SDK for aws (DocumentClient)
 * @param {string} tableName name of table in DynamoDB
 * @returns {updateDocumentReturn} Object searched from table
 */
export const updateDocument = (dynamo, tableName) => async (key, updateExpression, expressionAttributeValues) => {
  try {
    const params = {
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: remapPrevixVariables(expressionAttributeValues),
      ReturnValues: 'ALL_NEW'
    }
    /**
       * @constant
       * @type {DynamoDB.UpdateItemOutput}
      */
    const output = await dynamo.update(params).promise()

    return output.Attributes
  } catch (error) {
    throwCustomError(error, 'state-machines.aws.dynamo.updateDocument', classError.INTERNAL)
  }
}

/**
 * Delete a document on table TableName in the DynamoDB.
 *
 * @memberof ports/state-machines
 * @async
 * @function
 * @throws {CustomError}
 * @param {DynamoDB.DocumentClient} dynamo instance of Dynamo SDK for aws (DocumentClient)
 * @param {string} tableName name of table in DynamoDB
 * @returns {deleteDocumentReturn} Object searched from table
 */
export const deleteDocument = (dynamo, tableName) => async (key) => {
  try {
    const params = {
      TableName: tableName,
      Key: key,
      ReturnValues: 'ALL_OLD'
    }

    const result = await dynamo.delete(params).promise()

    return (R.not(R.isEmpty(result)) && R.not(R.isNil(result)) && R.not(R.isNil(result.Item))) ? result.Item : null
  } catch (error) {
    throwCustomError(error, 'state-machines.aws.dynamo.deleteDocument', classError.INTERNAL)
  }
}

/**
 * List documents on table TableName in the DynamoDB.
 *
 * @memberof ports/state-machines
 * @async
 * @function
 * @throws {CustomError}
 * @param {DynamoDB.DocumentClient} dynamo instance of Dynamo SDK for aws (DocumentClient)
 * @param {string} tableName name of table in DynamoDB
 * @returns {queryDocumentReturn} Documents searched from table
 */
export const queryDocument = (dynamo, tableName) => async (keyConditionExpression, filterExpression, expressionAttributeValues, consistentRead) => {
  try {
    const params = {
      ExpressionAttributeValues: expressionAttributeValues,
      KeyConditionExpression: keyConditionExpression,
      TableName: tableName,
      FilterExpression: filterExpression
    }

    const result = await dynamo.query(R.not(R.isNil(consistentRead)) ? { ...params, ConsistentRead: consistentRead } : params).promise()

    return result && result.Items ? result.Items : []
  } catch (error) {
    throwCustomError(error, 'state-machines.aws.dynamo.queryDocument', classError.INTERNAL)
  }
}

/**
 * @description Add ":" in all variables in prefix remaping the object
 *
 * @memberof state-machines
 * @function
 * @param {Object} obj object param in ExpressionAttributeValues
 * @returns {Object} object remaped
 */
export const remapPrevixVariables = (obj) => {
  return Object
    .keys(obj).reduce((prev, curr) => {
      return { ...prev, [`:${curr}`]: obj[curr] }
    }, {})
}

/***
 * type definitions for complex objects
 * this helps documentation
 */

/**
* This callback is displayed as part of the updateDocument (inner DynamoRepositoryInstance) function.
*
* @callback updateDocumentReturn
* @param {Object} key - object of keys table parameters to search
* @param {DynamoDB.UpdateExpression} updateExpression  dynamo notation of the update document expression without values to change
* @param {Object} expressionAttributeValues  values to be mapped in updateExpression expression
* @returns {Object} - object sended
*/

/**
* This callback is displayed as part of the getDocument (inner DynamoRepositoryInstance) function.
*
* @callback getDocumentReturn
* @param {Object} key - object of keys table parameters to search
* @returns {Object} - object updated from state-machine
*/

/**
* This callback is displayed as part of the putDocument (inner DynamoRepositoryInstance) function.
*
* @callback putDocumentReturn
* @param {Object} item - object to persist
* @returns {Object} - object inserted from state-machine
*/

/**
* This callback is displayed as part of the deleteDocument (inner DynamoRepositoryInstance) function.
*
* @callback deleteDocumentReturn
* @param {Object} key - key of the data
* @returns {Object} - object deleted from state-machine
*/

/**
* This callback is displayed as part of the queryDocument (inner DynamoRepositoryInstance) function.
*
* @callback queryDocumentReturn
* @param {string} keyConditionExpression expression for key condition. Ex.: a = :a
* @param {string} filterExpression expression for filter inner data Ex.: a = :a
* @param {Object} expressionAttributeValues expression for attribut values. Ex.: { ':a': 1 }
* @param {boolean} [consistentRead] determines the read consistency model. If set to true, then the operation uses strongly consistent reads; otherwise, the operation uses eventually consistent reads
* @returns {Promise<DynamoDB.DocumentClient.ItemList>}
*/
