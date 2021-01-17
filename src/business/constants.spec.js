import { ETalentRangeSalary, ETalentStatus, EOpeningStatus, EOperation, EPersistOperation, validatePersistOperation } from './constants'
import { EClassError } from '../utils'
import { throwCustomError } from '../utils/errors'

/** mock error generation to validate signature */
jest.mock('../utils/errors')

throwCustomError.mockImplementation((error) => {
  throw error
})

describe('constants', () => {
  test('ETalentStatus', () => {
    expect(ETalentStatus.CLOSED).toBe('CLOSED')
    expect(ETalentStatus.LOOKING).toBe('LOOKING')
    expect(ETalentStatus.OPEN).toBe('OPEN')
  })

  test('EOpeningStatus', () => {
    expect(EOpeningStatus.CLOSED).toBe('CLOSED')
    expect(EOpeningStatus.SUSPENDED).toBe('SUSPENDED')
    expect(EOpeningStatus.OPEN).toBe('OPEN')
  })
  test('ETalentRangeSalary', () => {
    expect(ETalentRangeSalary.BETWEEN10KAND15K).toBe('BETWEEN10KAND15K')
    expect(ETalentRangeSalary.BETWEEN5KAND10K).toBe('BETWEEN5KAND10K')
    expect(ETalentRangeSalary.HIGHER15K).toBe('HIGHER15K')
    expect(ETalentRangeSalary.LOWER5K).toBe('LOWER5K')
  })

  test('EOperation', () => {
    expect(EOperation.CREATE).toBe('CREATE')
    expect(EOperation.UPDATE).toBe('UPDATE')
    expect(EOperation.DELETE).toBe('DELETE')
    expect(EOperation.MATCH).toBe('MATCH')
  })
  test('EPersistOperation', () => {
    expect(EPersistOperation.ONLY_VALIDATE).toBe('ONLY_VALIDATE')
    expect(EPersistOperation.ALL).toBe('ALL')
  })
})

describe('validatePersistOperation', () => {
  test('validate invalid value', () => {
    const value = 'INVALID'
    const methodPath = 'business.constants.validatePersistOperation'
    const throwMessage = `invalid value for EPersistOperation (type): got ${value}`
    expect(() => {
      validatePersistOperation(value)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  test('valid values', () => {
    expect(validatePersistOperation(EPersistOperation.ALL)).toBe(EPersistOperation.ALL)
    expect(validatePersistOperation(EPersistOperation.ONLY_VALIDATE)).toBe(EPersistOperation.ONLY_VALIDATE)
  })
})
