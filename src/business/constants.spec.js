import { ETalentRangeSalary, ETalentStatus, EOpeningStatus } from './constants'

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
})
