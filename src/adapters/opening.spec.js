import { getDocument, putDocument, updateDocument, deleteDocument, queryDocument } from '../ports/state-machines/aws.dynamo'
import { sendMessage } from '../ports/state-machines/aws.sqs'
import openingAdapterFactory from './opening'
import { EOpeningStatus, ETalentRangeSalary, EPersistOperation, ETalentStatus } from '../business/constants'
import { validateUpdateOpening, validateCreateOpening } from '../business/opening'
import { validateCreateTalent } from '../business/talent'

import R from 'ramda'
import { v4 as uuidv4 } from 'uuid'
import { EClassError } from '../utils'
import { throwCustomError } from '../utils/errors'
import * as crypto from 'crypto'
/** mock error generation to validate signature */
jest.mock('../utils/errors')

/**
 * function/constants  for  test suite
 */
const randomString = (size = 21) => {
  return crypto
    .randomBytes(size)
    .toString('base64')
    .slice(0, size)
}

const toMD5 = (str) => {
  return crypto
    .createHash('md5')
    .update(str)
    .digest().toString('base64')
}

/** mock error generation to validate signature */
jest.mock('../utils/errors')

throwCustomError.mockImplementation((error) => {
  throw error
})

// this adapter will mock all methods from aws.dynamo port
jest.mock('../ports/state-machines/aws.dynamo')

// this adapter will mock all methods from aws.sqs port
jest.mock('../ports/state-machines/aws.sqs')

// mock escriba calls
const escribaMock = {
  info: jest.fn((args) => (args)).mockReturnValue(undefined),
  error: jest.fn((args) => (args)).mockReturnValue(undefined)
}

// mock repository structure to test your elements
const repositoryMock = {
  getDocument,
  putDocument,
  updateDocument,
  deleteDocument,
  queryDocument
}

const queueRepositoryMock = {
  sendMessage
}

const sendMessageMock = (args) => jest.fn().mockResolvedValue({
  MD5OfMessageBody: toMD5(randomString()),
  MD5OfMessageAttributes: toMD5(randomString()),
  MD5OfMessageSystemAttributes: toMD5(randomString()),
  MessageId: uuidv4(),
  SequenceNumber: 123
})

// mock instantiated adapter
const adapterInstiated = openingAdapterFactory(escribaMock, repositoryMock, queueRepositoryMock)
// mock async instantiated adapter
const adapterAsyncInstiated = openingAdapterFactory(escribaMock, repositoryMock, queueRepositoryMock, EPersistOperation.ONLY_VALIDATE)

describe('getOpening', () => {
  const methodPath = 'adapters.opening.getOpening'
  beforeEach(() => {
    getDocument.mockReset()
  })

  const getDocumentMock = (args) => jest.fn().mockResolvedValue(
    {
      ...validateCreateOpening({
        openingCompanyName: 'tester',
        openingJobName: 'DevOps Senior',
        openingEconomicSegment: 'Tecnology',
        openingSoftSkillsTags: ['leadership'],
        openingHardSkillsTags: ['java', 'devops', 'hashicorp'],
        openingRangeSalary: ETalentRangeSalary.BETWEEN10KAND15K,
        openingPositionTags: ['backend:senior', 'backend:junior', 'techleader'],
        openingResume: 'I Need yoy to work here plis :D',
        openingStatus: EOpeningStatus.OPEN
      }),
      id: args.id
    }
  )

  const newId = uuidv4()
  const newSegment = 'Tecnology'

  test('default case', async () => {
    repositoryMock.getDocument.mockImplementationOnce((args) => getDocumentMock(args)())

    await expect(adapterInstiated.getOpening(newId, newSegment))
      .resolves.toMatchObject({
        id: newId,
        openingCompanyName: 'tester',
        openingJobName: 'DevOps Senior',
        openingEconomicSegment: 'Tecnology',
        openingSoftSkillsTags: ['leadership'],
        openingHardSkillsTags: ['java', 'devops', 'hashicorp'],
        openingRangeSalary: ETalentRangeSalary.BETWEEN10KAND15K,
        openingPositionTags: ['backend:senior', 'backend:junior', 'techleader'],
        openingResume: 'I Need yoy to work here plis :D',
        openingStatus: EOpeningStatus.OPEN
      })
    expect(getDocument).toHaveBeenCalled()
    expect(getDocument).toHaveBeenLastCalledWith({ id: newId, openingEconomicSegment: newSegment })
  })

  test('throw error', async () => {
    const throwMessage = 'invalid id'
    const getDocumentErrorMock = (args) => jest.fn().mockRejectedValue(new Error(throwMessage))
    repositoryMock.getDocument.mockImplementationOnce((args) => getDocumentErrorMock(args)())
    await expect(adapterInstiated.getOpening(newId, newSegment)).rejects.toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(getDocument).toHaveBeenCalled()
    expect(getDocument).toHaveBeenLastCalledWith({ id: newId, openingEconomicSegment: newSegment })
  })
})

describe('createOpening', () => {
  const methodPath = 'adapters.opening.createOpening'
  beforeEach(() => {
    putDocument.mockReset()
    sendMessage.mockReset()
  })

  const putDocumentMock = (args) => jest.fn().mockResolvedValue(args)

  const newData = {
    openingCompanyName: 'tester',
    openingJobName: 'DevOps Senior',
    openingEconomicSegment: 'Tecnology',
    openingSoftSkillsTags: ['leadership'],
    openingHardSkillsTags: ['java', 'devops', 'hashicorp'],
    openingRangeSalary: ETalentRangeSalary.BETWEEN10KAND15K,
    openingPositionTags: ['backend:senior', 'backend:junior', 'techleader'],
    openingResume: 'I Need yoy to work here plis :D',
    openingStatus: EOpeningStatus.OPEN
  }

  test('default case', async () => {
    repositoryMock.putDocument.mockImplementationOnce((args) => putDocumentMock(args)())
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => sendMessageMock(args)())
    const insertedData = await adapterInstiated.createOpening(newData)

    expect(insertedData).toMatchObject({
      ...newData
    })
    expect(putDocument).toHaveBeenCalled()
    expect(putDocument).toHaveBeenLastCalledWith(insertedData)
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalledWith({
      action: 'OPENING_CREATED',
      method: methodPath,
      data: { documentInserted: insertedData }
    })
    expect(sendMessage).toHaveBeenCalled()
  })

  test(`default case with persistence: "ONLY_VALIDATE"`, async () => {
    repositoryMock.putDocument.mockImplementationOnce((args) => putDocumentMock(args)())
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => sendMessageMock(args)())
    const insertedData = await adapterAsyncInstiated.createOpening(newData)

    expect(insertedData).toMatchObject({
      ...newData
    })
    expect(putDocument).not.toHaveBeenCalled()
    expect(sendMessage).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).not.toHaveBeenCalledWith({
      action: 'OPENING_CREATED',
      method: methodPath,
      data: { documentInserted: insertedData }
    })
  })

  test(`default case with persistence: "ONLY_VALIDATE" with error on send message`, async () => {
    const throwMessage = 'error sending to queue'
    repositoryMock.putDocument.mockImplementationOnce((args) => putDocumentMock(args)())
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => jest.fn().mockRejectedValue(new Error(throwMessage))())
    await expect(adapterAsyncInstiated.createOpening(newData)).rejects.toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(putDocument).not.toHaveBeenCalled()
    expect(sendMessage).toHaveBeenCalled()
  })

  test('throw error when send to queue', async () => {
    const throwMessage = 'error sending to queue'
    repositoryMock.putDocument.mockImplementationOnce((args) => putDocumentMock(args)())
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => jest.fn().mockRejectedValue(new Error(throwMessage))())
    const insertedData = await adapterInstiated.createOpening(newData)

    expect(insertedData).toMatchObject({
      ...newData
    })
    expect(putDocument).toHaveBeenCalled()
    expect(putDocument).toHaveBeenLastCalledWith(insertedData)
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalledWith({
      action: 'OPENING_CREATED',
      method: methodPath,
      data: { documentInserted: insertedData }
    })
    expect(sendMessage).toHaveBeenCalled()
    expect(escribaMock.error).toHaveBeenCalled()
  })

  test('throw error', async () => {
    const throwMessage = 'invalid data'
    const putDocumentErrorMock = (args) => jest.fn().mockRejectedValue(new Error(throwMessage))
    repositoryMock.putDocument.mockImplementationOnce((args) => putDocumentErrorMock(args)())
    await expect(adapterInstiated.createOpening(newData)).rejects.toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(putDocument).toHaveBeenCalled()
  })

  test('throw error with invalid data (business validation)', async () => {
    repositoryMock.putDocument.mockImplementationOnce((args) => putDocumentMock(args)())
    await expect(adapterInstiated.createOpening({})).rejects.toThrow()
    expect(putDocument).not.toHaveBeenCalled()
  })
})

describe('updateOpening', () => {
  const methodPath = 'adapters.opening.updateOpening'
  beforeEach(() => {
    updateDocument.mockReset()
    getDocument.mockReset()
    sendMessage.mockReset()
  })

  const newData = validateCreateOpening({
    openingCompanyName: 'tester',
    openingJobName: 'DevOps Senior',
    openingEconomicSegment: 'Tecnology',
    openingSoftSkillsTags: ['leadership'],
    openingHardSkillsTags: ['java', 'devops', 'hashicorp'],
    openingRangeSalary: ETalentRangeSalary.BETWEEN10KAND15K,
    openingPositionTags: ['backend:senior', 'backend:junior', 'techleader'],
    openingResume: 'I Need yoy to work here plis :D',
    openingStatus: EOpeningStatus.OPEN
  })

  const updatedData = {
    ...newData,
    openingStatus: EOpeningStatus.CLOSED,
    talentLastSalaryRange: ETalentRangeSalary.NONE
  }

  const getDocumentMock = jest.fn().mockResolvedValue(newData)
  const updateOpeningMock = validateUpdateOpening(updatedData, newData)
  const updateDocumentMock = (key, updateExpression, expressionAttributeValues) => jest.fn().mockResolvedValue(updateOpeningMock)

  test('default case', async () => {
    repositoryMock.updateDocument.mockImplementationOnce((key, updateExpression, expressionAttributeValues) => updateDocumentMock(key, updateExpression, expressionAttributeValues)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => sendMessageMock(args)())
    const updateOpening = await adapterInstiated.updateOpening(newData.id, newData.openingEconomicSegment, updatedData)
    expect(updateOpening).toMatchObject(updateOpeningMock)
    const updateExpression = `
    set openingCompanyName = :openingCompanyName,
        openingJobName = :openingJobName,
        openingResume = :openingResume,
        openingSoftSkillsTags = :openingSoftSkillsTags,
        openingHardSkillsTags = :openingHardSkillsTags,
        openingPositionTags = :openingPositionTags,
        openingStatus = :openingStatus,
        lastUpdateDate = :lastUpdateDate,
        openingRangeSalary = :openingRangeSalary
    `
    expect(updateDocument).toHaveBeenCalled()
    expect(updateDocument).toHaveBeenCalledWith({ id: newData.id, openingEconomicSegment: newData.openingEconomicSegment }, updateExpression, expect.objectContaining(R.dissoc('lastUpdateDate', updateOpening)))
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalledWith({
      action: 'OPENING_UPDATED',
      method: methodPath,
      data: updateOpening
    })
    expect(sendMessage).toHaveBeenCalled()
  })

  test(`default case with persistence: "ONLY_VALIDATE"`, async () => {
    repositoryMock.updateDocument.mockImplementationOnce((key, updateExpression, expressionAttributeValues) => updateDocumentMock(key, updateExpression, expressionAttributeValues)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => sendMessageMock(args)())
    const updateOpening = await adapterAsyncInstiated.updateOpening(newData.id, newData.openingEconomicSegment, updatedData)
    expect(updateOpening).toMatchObject(R.dissoc('lastUpdateDate', updateOpeningMock))
    expect(updateDocument).not.toHaveBeenCalled()
    expect(sendMessage).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).not.toHaveBeenCalledWith({
      action: 'OPENING_UPDATED',
      method: methodPath,
      data: updateOpening
    })
  })

  test(`default case with persistence: "ONLY_VALIDATE" with error on send message`, async () => {
    const throwMessage = 'error sending to queue'
    repositoryMock.updateDocument.mockImplementationOnce((key, updateExpression, expressionAttributeValues) => updateDocumentMock(key, updateExpression, expressionAttributeValues)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => jest.fn().mockRejectedValue(new Error(throwMessage))())
    await expect(adapterAsyncInstiated.updateOpening(newData.id, newData.openingEconomicSegment, updatedData)).rejects.toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(putDocument).not.toHaveBeenCalled()
    expect(sendMessage).toHaveBeenCalled()
  })

  test('throw error when send to queue', async () => {
    const throwMessage = 'error sending to queue'
    repositoryMock.updateDocument.mockImplementationOnce((key, updateExpression, expressionAttributeValues) => updateDocumentMock(key, updateExpression, expressionAttributeValues)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => jest.fn().mockRejectedValue(new Error(throwMessage))())
    const updateOpening = await adapterInstiated.updateOpening(newData.id, newData.openingEconomicSegment, updatedData)
    expect(updateOpening).toMatchObject(updateOpeningMock)
    const updateExpression = `
    set openingCompanyName = :openingCompanyName,
        openingJobName = :openingJobName,
        openingResume = :openingResume,
        openingSoftSkillsTags = :openingSoftSkillsTags,
        openingHardSkillsTags = :openingHardSkillsTags,
        openingPositionTags = :openingPositionTags,
        openingStatus = :openingStatus,
        lastUpdateDate = :lastUpdateDate,
        openingRangeSalary = :openingRangeSalary
    `
    expect(updateDocument).toHaveBeenCalled()
    expect(updateDocument).toHaveBeenCalledWith({ id: newData.id, openingEconomicSegment: newData.openingEconomicSegment }, updateExpression, expect.objectContaining(R.dissoc('lastUpdateDate', updateOpening)))
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalledWith({
      action: 'OPENING_UPDATED',
      method: methodPath,
      data: updateOpening
    })
    expect(sendMessage).toHaveBeenCalled()
    expect(escribaMock.error).toHaveBeenCalled()
  })

  test('throw error', async () => {
    const throwMessage = 'invalid data'
    const updateDocumentMockError = (key, updateExpression, expressionAttributeValues) => jest.fn().mockRejectedValue(new Error(throwMessage))
    repositoryMock.updateDocument.mockImplementationOnce((key, updateExpression, expressionAttributeValues) => updateDocumentMockError(key, updateExpression, expressionAttributeValues)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)

    await expect(adapterInstiated.updateOpening(newData.id, newData.openingEconomicSegment, updatedData)).rejects.toThrow()
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(updateDocument).toHaveBeenCalled()
  })

  test('throw error with invalid data (business validation)', async () => {
    repositoryMock.updateDocument.mockImplementationOnce((key, updateExpression, expressionAttributeValues) => updateDocumentMock(key, updateExpression, expressionAttributeValues)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)

    await expect(adapterInstiated.updateOpening(newData.id, newData.openingEconomicSegment, {})).rejects.toThrow()
    expect(updateDocument).not.toHaveBeenCalled()
  })
})

describe('deleteOpening', () => {
  const methodPath = 'adapters.opening.deleteOpening'
  beforeEach(() => {
    deleteDocument.mockReset()
  })

  const newData = validateCreateOpening({
    openingCompanyName: 'tester',
    openingJobName: 'DevOps Senior',
    openingEconomicSegment: 'Tecnology',
    openingSoftSkillsTags: ['leadership'],
    openingHardSkillsTags: ['java', 'devops', 'hashicorp'],
    openingRangeSalary: ETalentRangeSalary.BETWEEN10KAND15K,
    openingPositionTags: ['backend:senior', 'backend:junior', 'techleader'],
    openingResume: 'I Need yoy to work here plis :D',
    openingStatus: EOpeningStatus.OPEN
  })

  const deleteDocumentMock = (args) => jest.fn().mockResolvedValue(newData)
  const getDocumentMock = jest.fn().mockResolvedValue(newData)

  test('default case', async () => {
    repositoryMock.deleteDocument.mockImplementationOnce((args) => deleteDocumentMock(args)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)
    const deletedOpening = await adapterInstiated.deleteOpening(newData.id, newData.openingEconomicSegment)
    expect(deletedOpening).toMatchObject(newData)
    expect(deleteDocument).toHaveBeenCalled()
    expect(deleteDocument).toHaveBeenCalledWith({ id: newData.id, openingEconomicSegment: newData.openingEconomicSegment })
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalledWith({
      action: 'OPENING_DELETED',
      method: methodPath,
      data: deletedOpening
    })
  })

  test(`default case with persistence: "ONLY_VALIDATE"`, async () => {
    repositoryMock.deleteDocument.mockImplementationOnce((args) => deleteDocumentMock(args)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => sendMessageMock(args)())
    const deletedOpening = await adapterAsyncInstiated.deleteOpening(newData.id, newData.openingEconomicSegment)
    expect(deletedOpening).toMatchObject(newData)
    expect(deleteDocument).not.toHaveBeenCalled()
    expect(sendMessage).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).not.toHaveBeenCalledWith({
      action: 'OPENING_DELETED',
      method: methodPath,
      data: deletedOpening
    })
  })

  test(`default case with persistence: "ONLY_VALIDATE" with error on send message`, async () => {
    const throwMessage = 'error sending to queue'
    repositoryMock.deleteDocument.mockImplementationOnce((args) => deleteDocumentMock(args)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => jest.fn().mockRejectedValue(new Error(throwMessage))())
    await expect(adapterAsyncInstiated.deleteOpening(newData.id, newData.openingEconomicSegment)).rejects.toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(putDocument).not.toHaveBeenCalled()
    expect(sendMessage).toHaveBeenCalled()
  })

  test('throw error', async () => {
    const throwMessage = 'invalid id'
    const deleteDocumentErrorMock = (args) => jest.fn().mockRejectedValue(new Error(throwMessage))
    repositoryMock.deleteDocument.mockImplementationOnce((args) => deleteDocumentErrorMock(args)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)

    await expect(adapterInstiated.deleteOpening(newData.id, newData.openingEconomicSegment)).rejects.toThrow()
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(getDocument).toHaveBeenCalled()
    expect(getDocument).toHaveBeenCalledWith({ id: newData.id, openingEconomicSegment: newData.openingEconomicSegment })
  })
})

describe('matchOpeningsFromTalent', () => {
  const methodPath = 'adapters.opening.matchOpeningsFromTalent'
  beforeEach(() => {
    queryDocument.mockReset()
  })

  const queryDocumentMock = (args) => jest.fn().mockResolvedValue(
    [{
      ...validateCreateOpening({
        openingCompanyName: 'tester',
        openingJobName: 'DevOps Senior',
        openingEconomicSegment: 'Tecnology',
        openingSoftSkillsTags: ['leadership'],
        openingHardSkillsTags: ['java', 'devops', 'hashicorp'],
        openingRangeSalary: ETalentRangeSalary.BETWEEN10KAND15K,
        openingPositionTags: ['backend:senior', 'backend:junior', 'techleader'],
        openingResume: 'I Need yoy to work here plis :D',
        openingStatus: EOpeningStatus.OPEN
      }),
      id: args.id
    },
    {
      ...validateCreateOpening({
        openingCompanyName: 'tester-2',
        openingJobName: 'DevOps Senior',
        openingEconomicSegment: 'Tecnology',
        openingSoftSkillsTags: ['leadership'],
        openingHardSkillsTags: ['javascripto'],
        openingRangeSalary: ETalentRangeSalary.BETWEEN10KAND15K,
        openingPositionTags: ['backend:senior', 'backend:junior', 'techleader'],
        openingResume: 'I Need yoy to work here plis :D',
        openingStatus: EOpeningStatus.OPEN
      }),
      id: args.id
    }]
  )

  test('default case', async () => {
    repositoryMock.queryDocument.mockImplementationOnce((args) => queryDocumentMock(args)())

    const talent = validateCreateTalent({
      talentName: 'tester',
      talentSurname: 'tester surname',
      talentEconomicSegment: 'Tecnology',
      talentSoftSkillsTags: ['leadership'],
      talentHardSkillsTags: ['java', 'devops', 'hashicorp'],
      talentLastSalaryRange: ETalentRangeSalary.BETWEEN10KAND15K,
      talentPositionTags: ['backend:senior', 'backend:junior', 'techleader'],
      talentResume: 'I\'m happy \n and i love my carreer',
      talentStatus: ETalentStatus.OPEN
    })

    await expect(adapterInstiated.matchOpeningsFromTalent(talent)).resolves.toHaveLength(2)
    expect(queryDocument).toHaveBeenCalled()
    expect(queryDocument).toHaveBeenLastCalledWith(
      'openingEconomicSegment = :openingEconomicSegment',
      ` openingStatus = :OPEN
  AND ( contains(openingPositionTags, :openingPositionTags0)
        OR contains(openingPositionTags, :openingPositionTags1)
        OR contains(openingPositionTags, :openingPositionTags2)
        OR contains(openingSoftSkillsTags, :openingSoftSkillsTags0)
        OR contains(openingHardSkillsTags, :openingHardSkillsTags0)
        OR contains(openingHardSkillsTags, :openingHardSkillsTags1)
        OR contains(openingHardSkillsTags, :openingHardSkillsTags2))`,
      {
        ':OPEN': 'OPEN',
        ':openingEconomicSegment': 'Tecnology',
        ':openingHardSkillsTags0': 'java',
        ':openingHardSkillsTags1': 'devops',
        ':openingHardSkillsTags2': 'hashicorp',
        ':openingPositionTags0': 'backend:senior',
        ':openingPositionTags1': 'backend:junior',
        ':openingPositionTags2': 'techleader',
        ':openingSoftSkillsTags0': 'leadership'
      })
  })

  test('throw error', async () => {
    const talent = validateCreateTalent({
      talentName: 'tester',
      talentSurname: 'tester surname',
      talentEconomicSegment: 'Tecnology',
      talentSoftSkillsTags: ['leadership'],
      talentHardSkillsTags: ['java', 'devops', 'hashicorp'],
      talentLastSalaryRange: ETalentRangeSalary.BETWEEN10KAND15K,
      talentPositionTags: ['backend:senior', 'backend:junior', 'techleader'],
      talentResume: 'I\'m happy \n and i love my carreer',
      talentStatus: ETalentStatus.OPEN
    })
    const throwMessage = 'invalid query'
    const queryDocumentErrorMock = (args) => jest.fn().mockRejectedValue(new Error(throwMessage))
    repositoryMock.queryDocument.mockImplementationOnce((args) => queryDocumentErrorMock(args)())
    await expect(adapterInstiated.matchOpeningsFromTalent(talent)).rejects.toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(queryDocument).toHaveBeenCalled()
  })
})

describe('openingAdapterFactory', () => {
  test('default case with empty persistOperation', () => {
    openingAdapterFactory(escribaMock, repositoryMock, queueRepositoryMock)
    expect(escribaMock.error).not.toHaveBeenCalled()
  })

  test('default case with persistOperation', () => {
    openingAdapterFactory(escribaMock, repositoryMock, queueRepositoryMock, EPersistOperation.ALL)
    expect(escribaMock.error).not.toHaveBeenCalled()
  })

  test('default case with persistOperation INVALID', () => {
    openingAdapterFactory(escribaMock, repositoryMock, queueRepositoryMock, 'INVALID')
    expect(escribaMock.error).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalledWith(`system operating in default persistence level: ${EPersistOperation.ALL}`)
  })
})
