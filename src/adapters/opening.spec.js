import { getDocument, putDocument, updateDocument, deleteDocument } from '../ports/state-machines/aws.dynamo'
import openingAdapterFactory from './opening'
import { EOpeningStatus, ETalentRangeSalary } from '../business/constants'
import { validateUpdateOpening, validateCreateOpening } from '../business/opening'
import R from 'ramda'
import { v4 as uuidv4 } from 'uuid'
import { EClassError } from '../utils'
import { throwCustomError } from '../utils/errors'

/** mock error generation to validate signature */
jest.mock('../utils/errors')

throwCustomError.mockImplementation((error) => {
  throw error
})

// this adapter will mock all methods from aws.dynamo port
jest.mock('../ports/state-machines/aws.dynamo')

// mock escriba calls
const escribaMock = {
  info: jest.fn((args) => (args)).mockReturnValue(undefined)
}

// mock repository structure to test your elements
const repositoryMock = {
  getDocument,
  putDocument,
  updateDocument,
  deleteDocument
}

// mock instantiated adapter
const adapterInstiated = openingAdapterFactory(escribaMock, repositoryMock)

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
    const deletedTalent = await adapterInstiated.deleteOpening(newData.id, newData.openingEconomicSegment)
    expect(deletedTalent).toMatchObject(newData)
    expect(deleteDocument).toHaveBeenCalled()
    expect(deleteDocument).toHaveBeenCalledWith({ id: newData.id, openingEconomicSegment: newData.openingEconomicSegment })
    expect(escribaMock.info).toHaveBeenCalled()
    expect(escribaMock.info).toHaveBeenCalledWith({
      action: 'OPENING_DELETED',
      method: methodPath,
      data: deletedTalent
    })
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
