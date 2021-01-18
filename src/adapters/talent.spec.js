import { getDocument, putDocument, updateDocument, deleteDocument, queryDocument } from '../ports/state-machines/aws.dynamo'
import { sendMessage } from '../ports/state-machines/aws.sqs'
import talentAdapterFactory from './talent'
import { ETalentStatus, ETalentRangeSalary, EPersistOperation, EOpeningStatus } from '../business/constants'
import { validateUpdateTalent, validateCreateTalent } from '../business/talent'
import { validateCreateOpening } from '../business/opening'
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
const adapterInstiated = talentAdapterFactory(escribaMock, repositoryMock, queueRepositoryMock)
// mock async instantiated adapter
const adapterAsyncInstiated = talentAdapterFactory(escribaMock, repositoryMock, queueRepositoryMock, EPersistOperation.ONLY_VALIDATE)

describe('getTalent', () => {
  const methodPath = 'adapters.talent.getTalent'
  beforeEach(() => {
    getDocument.mockReset()
  })

  const getDocumentMock = (args) => jest.fn().mockResolvedValue(
    {
      ...validateCreateTalent({
        talentName: 'tester',
        talentSurname: 'tester surname',
        talentEconomicSegment: 'Tecnology',
        talentSoftSkillsTags: ['leadership'],
        talentHardSkillsTags: ['java', 'devops', 'hashicorp'],
        talentLastSalaryRange: ETalentRangeSalary.BETWEEN10KAND15K,
        talentPositionTags: ['backend:senior', 'backend:junior', 'techleader'],
        talentResume: 'I\'m happy \n and i love my carreer',
        talentStatus: ETalentStatus.OPEN
      }),
      id: args.id
    }
  )

  const newId = uuidv4()
  const newSegment = 'Tecnology'

  test('default case', async () => {
    repositoryMock.getDocument.mockImplementationOnce((args) => getDocumentMock(args)())

    await expect(adapterInstiated.getTalent(newId, newSegment))
      .resolves.toMatchObject({
        id: newId,
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
    expect(getDocument).toHaveBeenCalled()
    expect(getDocument).toHaveBeenLastCalledWith({ id: newId, talentEconomicSegment: newSegment })
  })

  test('throw error', async () => {
    const throwMessage = 'invalid id'
    const getDocumentErrorMock = (args) => jest.fn().mockRejectedValue(new Error(throwMessage))
    repositoryMock.getDocument.mockImplementationOnce((args) => getDocumentErrorMock(args)())
    await expect(adapterInstiated.getTalent(newId, newSegment)).rejects.toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(getDocument).toHaveBeenCalled()
    expect(getDocument).toHaveBeenLastCalledWith({ id: newId, talentEconomicSegment: newSegment })
  })
})

describe('createTalent', () => {
  const methodPath = 'adapters.talent.createTalent'
  beforeEach(() => {
    putDocument.mockReset()
    sendMessage.mockReset()
  })

  const putDocumentMock = (args) => jest.fn().mockResolvedValue(args)

  const newData = {
    talentName: 'tester',
    talentSurname: 'tester surname',
    talentEconomicSegment: 'Tecnology',
    talentSoftSkillsTags: ['leadership'],
    talentHardSkillsTags: ['java', 'devops', 'hashicorp'],
    talentLastSalaryRange: ETalentRangeSalary.BETWEEN10KAND15K,
    talentPositionTags: ['backend:senior', 'backend:junior', 'techleader'],
    talentResume: 'I\'m happy \n and i love my carreer',
    talentStatus: ETalentStatus.OPEN
  }

  test('default case', async () => {
    repositoryMock.putDocument.mockImplementationOnce((args) => putDocumentMock(args)())
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => sendMessageMock(args)())
    const insertedData = await adapterInstiated.createTalent(newData)

    expect(insertedData).toMatchObject({
      ...newData
    })
    expect(putDocument).toHaveBeenCalled()
    expect(putDocument).toHaveBeenLastCalledWith(insertedData)
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalledWith({
      action: 'TALENT_CREATED',
      method: methodPath,
      data: { documentInserted: insertedData }
    })
    expect(sendMessage).toHaveBeenCalled()
  })

  test(`default case with persistence: "ONLY_VALIDATE"`, async () => {
    repositoryMock.putDocument.mockImplementationOnce((args) => putDocumentMock(args)())
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => sendMessageMock(args)())
    const insertedData = await adapterAsyncInstiated.createTalent(newData)

    expect(insertedData).toMatchObject({
      ...newData
    })
    expect(putDocument).not.toHaveBeenCalled()
    expect(sendMessage).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).not.toHaveBeenCalledWith({
      action: 'TALENT_CREATED',
      method: methodPath,
      data: { documentInserted: insertedData }
    })
  })

  test(`default case with persistence: "ONLY_VALIDATE" with error on send message`, async () => {
    const throwMessage = 'error sending to queue'
    repositoryMock.putDocument.mockImplementationOnce((args) => putDocumentMock(args)())
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => jest.fn().mockRejectedValue(new Error(throwMessage))())
    await expect(adapterAsyncInstiated.createTalent(newData)).rejects.toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(putDocument).not.toHaveBeenCalled()
    expect(sendMessage).toHaveBeenCalled()
  })

  test('throw error when send to queue', async () => {
    const throwMessage = 'error sending to queue'
    repositoryMock.putDocument.mockImplementationOnce((args) => putDocumentMock(args)())
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => jest.fn().mockRejectedValue(new Error(throwMessage))())
    const insertedData = await adapterInstiated.createTalent(newData)

    expect(insertedData).toMatchObject({
      ...newData
    })
    expect(putDocument).toHaveBeenCalled()
    expect(putDocument).toHaveBeenLastCalledWith(insertedData)
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalledWith({
      action: 'TALENT_CREATED',
      method: methodPath,
      data: { documentInserted: insertedData }
    })
    expect(escribaMock.error).toHaveBeenCalled()
  })

  test('throw error', async () => {
    const throwMessage = 'invalid data'
    const putDocumentErrorMock = (args) => jest.fn().mockRejectedValue(new Error(throwMessage))
    repositoryMock.putDocument.mockImplementationOnce((args) => putDocumentErrorMock(args)())
    await expect(adapterInstiated.createTalent(newData)).rejects.toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(putDocument).toHaveBeenCalled()
  })

  test('throw error with invalid data (business validation)', async () => {
    repositoryMock.putDocument.mockImplementationOnce((args) => putDocumentMock(args)())
    await expect(adapterInstiated.createTalent({})).rejects.toThrow()
    expect(putDocument).not.toHaveBeenCalled()
  })
})

describe('updateTalent', () => {
  const methodPath = 'adapters.talent.updateTalent'
  beforeEach(() => {
    updateDocument.mockReset()
    getDocument.mockReset()
    sendMessage.mockReset()
  })

  const newData = validateCreateTalent({
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

  const updatedData = {
    ...newData,
    talentStatus: ETalentStatus.CLOSED,
    talentLastSalaryRange: ETalentRangeSalary.NONE
  }

  const getDocumentMock = jest.fn().mockResolvedValue(newData)
  const updateTalentMock = validateUpdateTalent(updatedData, newData)
  const updateDocumentMock = (key, updateExpression, expressionAttributeValues) => jest.fn().mockResolvedValue(updateTalentMock)

  test('default case', async () => {
    repositoryMock.updateDocument.mockImplementationOnce((key, updateExpression, expressionAttributeValues) => updateDocumentMock(key, updateExpression, expressionAttributeValues)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => sendMessageMock(args)())
    const updateTalent = await adapterInstiated.updateTalent(newData.id, newData.talentEconomicSegment, updatedData)
    expect(updateTalent).toMatchObject(R.dissoc('lastUpdateDate', updateTalentMock))
    const updateExpression = `
    set talentName = :talentName,
        talentSurname = :talentSurname,
        talentResume = :talentResume,
        talentSoftSkillsTags = :talentSoftSkillsTags,
        talentHardSkillsTags = :talentHardSkillsTags,
        talentPositionTags = :talentPositionTags,
        talentStatus = :talentStatus,
        lastUpdateDate = :lastUpdateDate,
        talentLastSalaryRange = :talentLastSalaryRange
    `
    expect(updateDocument).toHaveBeenCalled()
    expect(updateDocument).toHaveBeenCalledWith({ id: newData.id, talentEconomicSegment: newData.talentEconomicSegment }, updateExpression, expect.objectContaining(R.dissoc('lastUpdateDate', updateTalent)))
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalledWith({
      action: 'TALENT_UPDATED',
      method: methodPath,
      data: updateTalent
    })
    expect(sendMessage).toHaveBeenCalled()
  })

  test(`default case with persistence: "ONLY_VALIDATE"`, async () => {
    repositoryMock.updateDocument.mockImplementationOnce((key, updateExpression, expressionAttributeValues) => updateDocumentMock(key, updateExpression, expressionAttributeValues)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => sendMessageMock(args)())
    const updateTalent = await adapterAsyncInstiated.updateTalent(newData.id, newData.talentEconomicSegment, updatedData)
    expect(updateTalent).toMatchObject(R.dissoc('lastUpdateDate', updateTalentMock))
    expect(updateDocument).not.toHaveBeenCalled()
    expect(sendMessage).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).not.toHaveBeenCalledWith({
      action: 'TALENT_UPDATED',
      method: methodPath,
      data: updateTalent
    })
  })

  test(`default case with persistence: "ONLY_VALIDATE" with error on send message`, async () => {
    const throwMessage = 'error sending to queue'
    repositoryMock.updateDocument.mockImplementationOnce((key, updateExpression, expressionAttributeValues) => updateDocumentMock(key, updateExpression, expressionAttributeValues)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => jest.fn().mockRejectedValue(new Error(throwMessage))())
    await expect(adapterAsyncInstiated.updateTalent(newData.id, newData.talentEconomicSegment, updatedData)).rejects.toThrow(throwMessage)
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
    const updateTalent = await adapterInstiated.updateTalent(newData.id, newData.talentEconomicSegment, updatedData)
    expect(updateTalent).toMatchObject(updateTalentMock)
    const updateExpression = `
    set talentName = :talentName,
        talentSurname = :talentSurname,
        talentResume = :talentResume,
        talentSoftSkillsTags = :talentSoftSkillsTags,
        talentHardSkillsTags = :talentHardSkillsTags,
        talentPositionTags = :talentPositionTags,
        talentStatus = :talentStatus,
        lastUpdateDate = :lastUpdateDate,
        talentLastSalaryRange = :talentLastSalaryRange
    `
    expect(updateDocument).toHaveBeenCalled()
    expect(updateDocument).toHaveBeenCalledWith({ id: newData.id, talentEconomicSegment: newData.talentEconomicSegment }, updateExpression, expect.objectContaining(R.dissoc('lastUpdateDate', updateTalent)))
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalledWith({
      action: 'TALENT_UPDATED',
      method: methodPath,
      data: updateTalent
    })
    expect(sendMessage).toHaveBeenCalled()
    expect(escribaMock.error).toHaveBeenCalled()
  })

  test('throw error', async () => {
    const throwMessage = 'invalid data'
    const updateDocumentMockError = (key, updateExpression, expressionAttributeValues) => jest.fn().mockRejectedValue(new Error(throwMessage))
    repositoryMock.updateDocument.mockImplementationOnce((key, updateExpression, expressionAttributeValues) => updateDocumentMockError(key, updateExpression, expressionAttributeValues)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)

    await expect(adapterInstiated.updateTalent(newData.id, newData.talentEconomicSegment, updatedData)).rejects.toThrow()
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(updateDocument).toHaveBeenCalled()
  })

  test('throw error with invalid data (business validation)', async () => {
    repositoryMock.updateDocument.mockImplementationOnce((key, updateExpression, expressionAttributeValues) => updateDocumentMock(key, updateExpression, expressionAttributeValues)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)

    await expect(adapterInstiated.updateTalent(newData.id, newData.talentEconomicSegment, {})).rejects.toThrow()
    expect(updateDocument).not.toHaveBeenCalled()
  })
})

describe('deleteTalent', () => {
  const methodPath = 'adapters.talent.deleteTalent'
  beforeEach(() => {
    deleteDocument.mockReset()
  })

  const newData = validateCreateTalent({
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

  const deleteDocumentMock = (args) => jest.fn().mockResolvedValue(newData)
  const getDocumentMock = jest.fn().mockResolvedValue(newData)

  test('default case', async () => {
    repositoryMock.deleteDocument.mockImplementationOnce((args) => deleteDocumentMock(args)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)
    const deletedTalent = await adapterInstiated.deleteTalent(newData.id, newData.talentEconomicSegment)
    expect(deletedTalent).toMatchObject(newData)
    expect(deleteDocument).toHaveBeenCalled()
    expect(deleteDocument).toHaveBeenCalledWith({ id: newData.id, talentEconomicSegment: newData.talentEconomicSegment })
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalledWith({
      action: 'TALENT_DELETED',
      method: methodPath,
      data: deletedTalent
    })
  })

  test(`default case with persistence: "ONLY_VALIDATE"`, async () => {
    repositoryMock.deleteDocument.mockImplementationOnce((args) => deleteDocumentMock(args)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => sendMessageMock(args)())
    const deletedTalent = await adapterAsyncInstiated.deleteTalent(newData.id, newData.talentEconomicSegment)
    expect(deletedTalent).toMatchObject(newData)
    expect(deleteDocument).not.toHaveBeenCalled()
    expect(sendMessage).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).not.toHaveBeenCalledWith({
      action: 'TALENT_DELETED',
      method: methodPath,
      data: deletedTalent
    })
  })

  test(`default case with persistence: "ONLY_VALIDATE" with error on send message`, async () => {
    const throwMessage = 'error sending to queue'
    repositoryMock.deleteDocument.mockImplementationOnce((args) => deleteDocumentMock(args)())
    repositoryMock.getDocument.mockImplementationOnce(getDocumentMock)
    queueRepositoryMock.sendMessage.mockImplementationOnce((args) => jest.fn().mockRejectedValue(new Error(throwMessage))())
    await expect(adapterAsyncInstiated.deleteTalent(newData.id, newData.talentEconomicSegment)).rejects.toThrow(throwMessage)
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

    await expect(adapterInstiated.deleteTalent(newData.id, newData.talentEconomicSegment)).rejects.toThrow()
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(getDocument).toHaveBeenCalled()
    expect(getDocument).toHaveBeenCalledWith({ id: newData.id, talentEconomicSegment: newData.talentEconomicSegment })
  })
})

describe('matchTalentsFromOpening', () => {
  const methodPath = 'adapters.talent.matchTalentsFromOpening'
  beforeEach(() => {
    queryDocument.mockReset()
  })

  const queryDocumentMock = (args) => jest.fn().mockResolvedValue(
    [{
      ...validateCreateTalent({
        talentName: 'tester',
        talentSurname: 'tester surname',
        talentEconomicSegment: 'Tecnology',
        talentSoftSkillsTags: ['leadership'],
        talentHardSkillsTags: ['java', 'devops', 'hashicorp'],
        talentLastSalaryRange: ETalentRangeSalary.BETWEEN10KAND15K,
        talentPositionTags: ['backend:senior', 'backend:junior', 'techleader'],
        talentResume: 'I\'m happy \n and i love my carreer',
        talentStatus: ETalentStatus.OPEN
      }),
      id: args.id
    },
    {
      ...validateCreateTalent({
        talentName: 'tester-2',
        talentSurname: 'tester-2 surname',
        talentEconomicSegment: 'Tecnology',
        talentSoftSkillsTags: ['leadership'],
        talentHardSkillsTags: ['javascripto'],
        talentLastSalaryRange: ETalentRangeSalary.BETWEEN10KAND15K,
        talentPositionTags: [],
        talentResume: 'I\'m happy \n and i love my carreer',
        talentStatus: ETalentStatus.OPEN
      }),
      id: args.id
    }]
  )

  test('default case', async () => {
    repositoryMock.queryDocument.mockImplementationOnce((args) => queryDocumentMock(args)())

    const opening = validateCreateOpening({
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

    await expect(adapterInstiated.matchTalentsFromOpening(opening)).resolves.toHaveLength(2)
    expect(queryDocument).toHaveBeenCalled()
    expect(queryDocument).toHaveBeenLastCalledWith(
      'talentEconomicSegment = :talentEconomicSegment',
      ` talentStatus in (:OPEN, :LOOKING)
  AND ( contains(talentPositionTags, :talentPositionTags0)
        OR contains(talentPositionTags, :talentPositionTags1)
        OR contains(talentPositionTags, :talentPositionTags2)
        OR contains(talentSoftSkillsTags, :talentSoftSkillsTags0)
        OR contains(talentHardSkillsTags, :talentHardSkillsTags0)
        OR contains(talentHardSkillsTags, :talentHardSkillsTags1)
        OR contains(talentHardSkillsTags, :talentHardSkillsTags2))`,
      {
        ':LOOKING': 'LOOKING',
        ':OPEN': 'OPEN',
        ':talentEconomicSegment': 'Tecnology',
        ':talentHardSkillsTags0': 'java',
        ':talentHardSkillsTags1': 'devops',
        ':talentHardSkillsTags2': 'hashicorp',
        ':talentPositionTags0': 'backend:senior',
        ':talentPositionTags1': 'backend:junior',
        ':talentPositionTags2': 'techleader',
        ':talentSoftSkillsTags0': 'leadership'
      })
  })

  test('throw error', async () => {
    const opening = validateCreateOpening({
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
    const throwMessage = 'invalid query'
    const queryDocumentErrorMock = (args) => jest.fn().mockRejectedValue(new Error(throwMessage))
    repositoryMock.queryDocument.mockImplementationOnce((args) => queryDocumentErrorMock(args)())
    await expect(adapterInstiated.matchTalentsFromOpening(opening)).rejects.toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(queryDocument).toHaveBeenCalled()
  })
})

describe('talentAdapterFactory', () => {
  test('default case with empty persistOperation', () => {
    talentAdapterFactory(escribaMock, repositoryMock, queueRepositoryMock)
    expect(escribaMock.error).not.toHaveBeenCalled()
  })

  test('default case with persistOperation', () => {
    talentAdapterFactory(escribaMock, repositoryMock, queueRepositoryMock, EPersistOperation.ALL)
    expect(escribaMock.error).not.toHaveBeenCalled()
  })

  test('default case with persistOperation INVALID', () => {
    talentAdapterFactory(escribaMock, repositoryMock, queueRepositoryMock, 'INVALID')
    expect(escribaMock.error).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalledWith(`system operating in default persistence level: ${EPersistOperation.ALL}`)
  })
})
