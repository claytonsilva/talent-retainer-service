import { validateInnerArrayString } from './common'

describe('validateInnerArrayString', () => {
  test('Normal value', () => {
    expect(validateInnerArrayString(['str1', 'str2'])).toBe(true)
  })

  test('Invalid values', () => {
    [[1, 's'], null, 's', 1, undefined, {}].forEach((testCase) => {
      expect(validateInnerArrayString(testCase)).toBe(false)
    })
  })
})
