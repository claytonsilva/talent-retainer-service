import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { databaseRepository } from './index'
import { remapPrevixVariables } from './aws.dynamo'
import { v4 as uuidv4 } from 'uuid'
import { EClassError } from '../../utils'
import { throwCustomError } from '../../utils/errors'

/**
 * jest invocation for aws-sdk
 */
jest.mock('aws-sdk/clients/dynamodb')
jest.mock('../../utils/errors')

const dynamo = new DocumentClient()
const tableName = 'mockTable'
const repoInstance = databaseRepository(dynamo, 'mockTable')

throwCustomError.mockImplementation((error) => {
  throw error
})

const dynamoMockObject = {
  get: (Params) => jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Item: {
        id: Params.Key.id,
        description: 'mockResult'
      }
    })
  }),
  put: (Params) => jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue(Params.Item)
  }),
  update: (Params) => jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Attributes: {
        id: Params.Key.id,
        description: 'mockResult'
      }
    })
  }),
  delete: (Params) => jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Item: {
        id: Params.Key.id,
        description: 'mockResult'
      }
    })
  })
}

describe('getDocument', () => {
  beforeEach(() => {
    DocumentClient.mockReset()
  })
  const methodPath = 'state-machines.aws.dynamo.getDocument'
  test('default case', async () => {
    dynamo.get.mockImplementationOnce((Params) => dynamoMockObject.get(Params)())
    const newId = uuidv4()

    await expect(repoInstance.getDocument({ id: newId }))
      .resolves.toMatchObject({
        id: newId,
        description: 'mockResult'
      })
    expect(dynamo.get).toHaveBeenCalled()
    expect(dynamo.get).toHaveBeenCalledWith({ Key: { id: newId }, TableName: tableName })
  })

  test('error', async () => {
    const throwMessage = 'invalid id'
    dynamo.get.mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error(throwMessage))
    }))
    const newId = uuidv4()
    await expect(repoInstance.getDocument({ id: newId })).rejects.toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(dynamo.get).toHaveBeenCalled()
    expect(dynamo.get).toHaveBeenCalledWith({ Key: { id: newId }, TableName: tableName })
  })

  test('null result.Item', async () => {
    dynamo.get.mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: null })
    }))
    const newId = uuidv4()

    await expect(repoInstance.getDocument({ id: newId })).resolves.toBe(null)
    expect(dynamo.get).toHaveBeenCalled()
    expect(dynamo.get).toHaveBeenCalledWith({ Key: { id: newId }, TableName: tableName })
  })

  test('null result value', async () => {
    dynamo.get.mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue(null)
    }))
    const newId = uuidv4()

    await expect(repoInstance.getDocument({ id: newId })).resolves.toBe(null)
    expect(dynamo.get).toHaveBeenCalled()
    expect(dynamo.get).toHaveBeenCalledWith({ Key: { id: newId }, TableName: tableName })
  })
})

describe('putDocument', () => {
  beforeEach(() => {
    DocumentClient.mockReset()
  })
  const methodPath = 'state-machines.aws.dynamo.putDocument'
  test('default case', async () => {
    dynamo.put.mockImplementationOnce((Params) => dynamoMockObject.put(Params)())
    const newId = uuidv4()

    await expect(repoInstance.putDocument({
      id: newId,
      description: 'mockResult'
    }))
      .resolves.toMatchObject({
        id: newId,
        description: 'mockResult'
      })
    expect(dynamo.put).toHaveBeenCalled()
    expect(dynamo.put).toHaveBeenCalledWith({
      Item: {
        id: newId,
        description: 'mockResult'
      },
      TableName: tableName
    })
  })

  test('error', async () => {
    const throwMessage = 'invalid entry'
    dynamo.put.mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error(throwMessage))
    }))
    const newId = uuidv4()

    await expect(repoInstance.putDocument({
      id: newId,
      description: 'mockResult'
    })).rejects.toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(dynamo.put).toHaveBeenCalled()
    expect(dynamo.put).toHaveBeenCalledWith({
      Item: {
        id: newId,
        description: 'mockResult'
      },
      TableName: tableName
    })
  })
})

describe('updateDocument', () => {
  beforeEach(() => {
    DocumentClient.mockReset()
  })
  const methodPath = 'state-machines.aws.dynamo.updateDocument'
  test('default case', async () => {
    dynamo.update.mockImplementationOnce((Params) => dynamoMockObject.update(Params)())
    const newId = uuidv4()

    await expect(repoInstance.updateDocument(
      {
        id: newId
      },
      'description := :description',
      { description: 'mockResult' }
    ))
      .resolves.toMatchObject({
        id: newId,
        description: 'mockResult'
      })
    expect(dynamo.update).toHaveBeenCalled()
    expect(dynamo.update).toHaveBeenCalledWith({
      Key: { id: newId },
      TableName: tableName,
      UpdateExpression: 'description := :description',
      ExpressionAttributeValues: remapPrevixVariables({ description: 'mockResult' }),
      ReturnValues: 'ALL_NEW'
    })
  })

  test('error', async () => {
    const throwMessage = 'invalid entry'
    dynamo.update.mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error(throwMessage))
    }))
    const newId = uuidv4()

    await expect(repoInstance.updateDocument(
      {
        id: newId
      },
      'description := :description',
      { description: 'mockResult' }
    )).rejects.toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(dynamo.update).toHaveBeenCalled()
    expect(dynamo.update).toHaveBeenCalledWith({
      Key: { id: newId },
      TableName: tableName,
      UpdateExpression: 'description := :description',
      ExpressionAttributeValues: remapPrevixVariables({ description: 'mockResult' }),
      ReturnValues: 'ALL_NEW'
    })
  })
})

describe('deleteDocument', () => {
  beforeEach(() => {
    DocumentClient.mockReset()
  })
  const methodPath = 'state-machines.aws.dynamo.deleteDocument'
  test('default case', async () => {
    dynamo.delete.mockImplementationOnce((Params) => dynamoMockObject.delete(Params)())
    const newId = uuidv4()

    await expect(repoInstance.deleteDocument({ id: newId }))
      .resolves.toMatchObject({
        id: newId,
        description: 'mockResult'
      })
    expect(dynamo.delete).toHaveBeenCalled()
    expect(dynamo.delete).toHaveBeenCalledWith({ Key: { id: newId }, ReturnValues: 'ALL_OLD', TableName: tableName })
  })

  test('error', async () => {
    const throwMessage = 'invalid id'
    dynamo.delete.mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error(throwMessage))
    }))
    const newId = uuidv4()

    await expect(repoInstance.deleteDocument({ id: newId })).rejects.toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(dynamo.delete).toHaveBeenCalled()
    expect(dynamo.delete).toHaveBeenCalledWith({ Key: { id: newId }, ReturnValues: 'ALL_OLD', TableName: tableName })
  })

  test('null result.Item', async () => {
    dynamo.delete.mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: null })
    }))
    const newId = uuidv4()

    await expect(repoInstance.deleteDocument({ id: newId })).resolves.toBe(null)
    expect(dynamo.delete).toHaveBeenCalled()
    expect(dynamo.delete).toHaveBeenCalledWith({ Key: { id: newId }, ReturnValues: 'ALL_OLD', TableName: tableName })
  })
})

describe('remapPrevixVariables', () => {
  test('default case', () => {
    const remmaped = remapPrevixVariables({ a: 'a' })
    expect(remmaped).toMatchObject({ ':a': 'a' })
  })

  test('empty', () => {
    const remmaped = remapPrevixVariables({})
    expect(remmaped).toMatchObject({})
  })
})
