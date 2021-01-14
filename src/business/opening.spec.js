// eslint-disable-next-line no-unused-vars
import { MutateOpeningInputCreate, MutateOpeningInputUpdate } from '../business'
import { EOpeningStatus, ETalentRangeSalary } from './constants'
import { validateCreateOpening, validateUpdateOpening, validateDeleteOpening } from './opening'
import { EClassError } from '../utils'
import { throwCustomError } from '../utils/errors'

/** mock error generation to validate signature */
jest.mock('../utils/errors')

throwCustomError.mockImplementation((error) => {
  throw error
})

describe('validateCreateOpening', () => {
  const methodPath = 'business.opening.validateCreateOpening'
  /**
   * @constant
   * @type {MutateOpeningInputCreate}
   */
  const validateCaseDefault = {
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

  test('validate default case', () => {
    expect(validateCreateOpening(validateCaseDefault)).toMatchObject({
      ...validateCaseDefault
    })
  })

  /**
   * @constant
   * @type {MutateOpeningInputCreate}
   */
  const validateCaseStatusInvalid = {
    ...validateCaseDefault,
    openingStatus: 'INVALID'
  }

  test('validate invalid openingStatus', () => {
    const throwMessage = `invalid value for openingStatus: got ${validateCaseStatusInvalid.openingStatus}`
    expect(() => {
      validateCreateOpening(validateCaseStatusInvalid)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  /**
   * @constant
   * @type {MutateOpeningInputCreate}
   */
  const validateCaseSalaryRangeInvalid = {
    ...validateCaseDefault,
    openingRangeSalary: 'INVALID'
  }

  test('validate invalid openingRangeSalary on create', () => {
    const throwMessage = `invalid value for openingRangeSalary: got ${validateCaseSalaryRangeInvalid.openingRangeSalary}`
    expect(() => {
      validateCreateOpening(validateCaseSalaryRangeInvalid)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  /**
   * @constant
   * @type {MutateOpeningInputCreate}
   */
  const validateNullopeningCompanyName = {
    ...validateCaseDefault,
    openingCompanyName: null
  }

  test('validate null openingCompanyName on create', () => {
    const throwMessage = 'invalid entry on field data, missing information about openingCompanyName'
    expect(() => {
      validateCreateOpening(validateNullopeningCompanyName)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  /**
   * @constant
   * @type {MutateOpeningInputCreate}
   */
  const validateNullopeningJobName = {
    ...validateCaseDefault,
    openingJobName: null
  }

  test('validate null openingJobName on create', () => {
    const throwMessage = 'invalid entry on field data, missing information about openingJobName'
    expect(() => {
      validateCreateOpening(validateNullopeningJobName)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  /**
   * @constant
   * @type {MutateOpeningInputCreate}
   */
  const validateNullopeningEconomicSegment = {
    ...validateCaseDefault,
    openingEconomicSegment: null
  }

  test('validate null openingEconomicSegment on create', () => {
    const throwMessage = 'invalid entry on field data, missing information about openingEconomicSegment'
    expect(() => {
      validateCreateOpening(validateNullopeningEconomicSegment)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  const validateNullData = null

  test('validate null data on create', () => {
    const throwMessage = 'invalid entry on field data, missing information'
    expect(() => {
      validateCreateOpening(validateNullData)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  const invalidArrayStrings = [[1, 's'], null, 's', 1, undefined, {}]
  const validArrayStrings = [[], ['a', 'b', 'c']]

  invalidArrayStrings.forEach((value) => {
    /**
     * @constant
     * @type {MutateOpeningInputCreate}
     */
    const caseToValidateHardSkillsArrayTags = {
      ...validateCaseDefault,
      openingHardSkillsTags: value
    }
    test(`(invalid arrays) validate openingHardSkillsTags data content on create "${JSON.stringify(value)}"`, () => {
      const throwMessage = 'invalid value for openingHardSkillsTags'
      expect(() => {
        validateCreateOpening(caseToValidateHardSkillsArrayTags)
      }).toThrow(throwMessage)
      // throws correct message
      expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
    })

    /**
     * @constant
     * @type {MutateOpeningInputCreate}
     */
    const caseToValidateSoftSkillsArrayTags = {
      ...validateCaseDefault,
      openingSoftSkillsTags: value
    }
    test(`(invalid arrays) validate openingSoftSkillsTags data content on create "${JSON.stringify(value)}"`, () => {
      const throwMessage = 'invalid value for openingSoftSkillsTags'
      expect(() => {
        validateCreateOpening(caseToValidateSoftSkillsArrayTags)
      }).toThrow(throwMessage)
      // throws correct message
      expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
    })

    /**
     * @constant
     * @type {MutateOpeningInputCreate}
     */
    const caseToValidatePositionArrayTags = {
      ...validateCaseDefault,
      openingPositionTags: value
    }
    test(`(invalid arrays) validate openingPositionTags data content on create "${JSON.stringify(value)}"`, () => {
      const throwMessage = 'invalid value for openingPositionTags'
      expect(() => {
        validateCreateOpening(caseToValidatePositionArrayTags)
      }).toThrow(throwMessage)
      // throws correct message
      expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
    })
  })

  validArrayStrings.forEach((value) => {
    /**
     * @constant
     * @type {MutateOpeningInputCreate}
     */
    const caseToValidateHardSkillsArrayTags = {
      ...validateCaseDefault,
      openingHardSkillsTags: value
    }
    test(`(valid arrays) validate openingHardSkillsTags data content on create "${JSON.stringify(value)}"`, () => {
      expect(() => {
        validateCreateOpening(caseToValidateHardSkillsArrayTags)
      }).not.toThrow()
    })

    /**
     * @constant
     * @type {MutateOpeningInputCreate}
     */
    const caseToValidateSoftSkillsArrayTags = {
      ...validateCaseDefault,
      openingSoftSkillsTags: value
    }
    test(`(valid arrays) validate openingSoftSkillsTags data content on create "${JSON.stringify(value)}"`, () => {
      expect(() => {
        validateCreateOpening(caseToValidateSoftSkillsArrayTags)
      }).not.toThrow()
    })

    /**
     * @constant
     * @type {MutateOpeningInputCreate}
     */
    const caseToValidatePositionArrayTags = {
      ...validateCaseDefault,
      openingPositionTags: value
    }
    test(`(valid arrays) validate openingPositionTags data content on create "${JSON.stringify(value)}"`, () => {
      expect(() => {
        validateCreateOpening(caseToValidatePositionArrayTags)
      }).not.toThrow()
    })
  })
})

describe('validateUpdateOpening', () => {
  const methodPath = 'business.opening.validateUpdateOpening'
  const defaultOriginalData = validateCreateOpening({
    openingCompanyName: 'tester',
    openingJobName: 'tester surname',
    openingEconomicSegment: 'Tecnology',
    openingSoftSkillsTags: ['leadership'],
    openingHardSkillsTags: ['java', 'devops', 'hashicorp'],
    openingRangeSalary: ETalentRangeSalary.BETWEEN10KAND15K,
    openingPositionTags: ['backend:senior', 'backend:junior', 'techleader'],
    openingResume: 'I\'m happy \n and i love my carreer',
    openingStatus: EOpeningStatus.OPEN
  })

  /**
   * @constant
   * @type {MutateOpeningInputUpdate}
   */
  const validateCaseDefaultUpdate = {
    ...defaultOriginalData,
    openingJobName: 'updated data',
    openingStatus: EOpeningStatus.CLOSED
  }

  test('validate null originalData on update', () => {
    const throwMessage = 'no data for this id'
    expect(() => {
      validateUpdateOpening(validateCaseDefaultUpdate)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  test('validate data when is null for update', () => {
    const throwMessage = 'invalid entry on field data, missing information'
    expect(() => {
      validateUpdateOpening(null, defaultOriginalData)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  test('validate normal update', () => {
    const updatedData = validateUpdateOpening(validateCaseDefaultUpdate, defaultOriginalData, 'testUser')
    expect(updatedData)
      .toMatchObject({
        openingJobName: 'updated data',
        openingStatus: EOpeningStatus.CLOSED
      })

    expect(updatedData.lastUpdateDate)
      .not.toBe(null)
    expect(updatedData)
      .not.toHaveProperty('id')
  })

  /**
   * validate correct field usage on update
   */

  /**
   * @constant
   * @type {MutateOpeningInputUpdate}
   */
  const validateCaseStatusInvalid = {
    ...defaultOriginalData,
    openingStatus: 'INVALID'
  }

  test('validate invalid openingStatus', () => {
    const throwMessage = `invalid value for openingStatus: got ${validateCaseStatusInvalid.openingStatus}`
    expect(() => {
      validateUpdateOpening(validateCaseStatusInvalid, defaultOriginalData)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  /**
   * @constant
   * @type {MutateOpeningInputUpdate}
   */
  const validateCaseSalaryRangeInvalid = {
    ...defaultOriginalData,
    openingRangeSalary: 'INVALID'
  }

  test('validate invalid openingRangeSalary on create', () => {
    const throwMessage = `invalid value for openingRangeSalary: got ${validateCaseSalaryRangeInvalid.openingRangeSalary}`
    expect(() => {
      validateUpdateOpening(validateCaseSalaryRangeInvalid, defaultOriginalData)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  /**
   * @constant
   * @type {MutateOpeningInputUpdate}
   */
  const validateNullopeningCompanyName = {
    ...defaultOriginalData,
    openingCompanyName: null
  }

  test('validate null openingCompanyName on create', () => {
    const throwMessage = 'invalid entry on field data, missing information about openingCompanyName'
    expect(() => {
      validateUpdateOpening(validateNullopeningCompanyName, defaultOriginalData)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  /**
   * @constant
   * @type {MutateOpeningInputUpdate}
   */
  const validateNullopeningJobName = {
    ...defaultOriginalData,
    openingJobName: null
  }

  test('validate null openingJobName on create', () => {
    const throwMessage = 'invalid entry on field data, missing information about openingJobName'
    expect(() => {
      validateUpdateOpening(validateNullopeningJobName, defaultOriginalData)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  const invalidArrayStrings = [[1, 's'], null, 's', 1, undefined, {}]
  const validArrayStrings = [[], ['a', 'b', 'c']]

  invalidArrayStrings.forEach((value) => {
    /**
     * @constant
     * @type {MutateOpeningInputUpdate}
     */
    const caseToValidateHardSkillsArrayTags = {
      ...defaultOriginalData,
      openingHardSkillsTags: value
    }
    test(`(invalid arrays) validate openingHardSkillsTags data content on create "${JSON.stringify(value)}"`, () => {
      const throwMessage = 'invalid value for openingHardSkillsTags'
      expect(() => {
        validateUpdateOpening(caseToValidateHardSkillsArrayTags, defaultOriginalData)
      }).toThrow(throwMessage)
      // throws correct message
      expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
    })

    /**
     * @constant
     * @type {MutateOpeningInputUpdate}
     */
    const caseToValidateSoftSkillsArrayTags = {
      ...defaultOriginalData,
      openingSoftSkillsTags: value
    }
    test(`(invalid arrays) validate openingSoftSkillsTags data content on create "${JSON.stringify(value)}"`, () => {
      const throwMessage = 'invalid value for openingSoftSkillsTags'
      expect(() => {
        validateUpdateOpening(caseToValidateSoftSkillsArrayTags, defaultOriginalData)
      }).toThrow(throwMessage)
      // throws correct message
      expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
    })

    /**
     * @constant
     * @type {MutateOpeningInputUpdate}
     */
    const caseToValidatePositionArrayTags = {
      ...defaultOriginalData,
      openingPositionTags: value
    }
    test(`(invalid arrays) validate openingPositionTags data content on create "${JSON.stringify(value)}"`, () => {
      const throwMessage = 'invalid value for openingPositionTags'
      expect(() => {
        validateUpdateOpening(caseToValidatePositionArrayTags, defaultOriginalData)
      }).toThrow(throwMessage)
      // throws correct message
      expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
    })
  })

  validArrayStrings.forEach((value) => {
    /**
     * @constant
     * @type {MutateOpeningInputUpdate}
     */
    const caseToValidateHardSkillsArrayTags = {
      ...defaultOriginalData,
      openingHardSkillsTags: value
    }
    test(`(valid arrays) validate openingHardSkillsTags data content on create "${JSON.stringify(value)}"`, () => {
      expect(() => {
        validateUpdateOpening(caseToValidateHardSkillsArrayTags, defaultOriginalData)
      }).not.toThrow()
    })

    /**
     * @constant
     * @type {MutateOpeningInputUpdate}
     */
    const caseToValidateSoftSkillsArrayTags = {
      ...defaultOriginalData,
      openingSoftSkillsTags: value
    }
    test(`(valid arrays) validate openingSoftSkillsTags data content on create "${JSON.stringify(value)}"`, () => {
      expect(() => {
        validateUpdateOpening(caseToValidateSoftSkillsArrayTags, defaultOriginalData)
      }).not.toThrow()
    })

    /**
     * @constant
     * @type {MutateOpeningInputUpdate}
     */
    const caseToValidatePositionArrayTags = {
      ...defaultOriginalData,
      openingPositionTags: value
    }
    test(`(valid arrays) validate openingPositionTags data content on create "${JSON.stringify(value)}"`, () => {
      expect(() => {
        validateUpdateOpening(caseToValidatePositionArrayTags, defaultOriginalData)
      }).not.toThrow()
    })
  })
})

describe('validateDeleteOpening', () => {
  const methodPath = 'business.opening.validateDeleteOpening'
  const defaultOriginalData = validateCreateOpening({
    openingCompanyName: 'tester',
    openingJobName: 'tester surname',
    openingEconomicSegment: 'Tecnology',
    openingSoftSkillsTags: ['leadership'],
    openingHardSkillsTags: ['java', 'devops', 'hashicorp'],
    openingRangeSalary: ETalentRangeSalary.BETWEEN10KAND15K,
    openingPositionTags: ['backend:senior', 'backend:junior', 'techleader'],
    openingResume: 'I\'m happy \n and i love my carreer',
    openingStatus: EOpeningStatus.OPEN
  })

  test('validate null originalData on update', () => {
    const throwMessage = 'no data for this id'
    expect(() => {
      validateDeleteOpening(null)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  test('validate normal delete', () => {
    expect(validateDeleteOpening(defaultOriginalData))
      .toMatchObject(defaultOriginalData)
  })
})
