// eslint-disable-next-line no-unused-vars
import { MutateTalentInputCreate, MutateTalentInputUpdate } from '../business'
import { ETalentStatus, ETalentRangeSalary } from './constants'
import { validateCreateTalent, validateUpdateTalent, validateDeleteTalent } from './talent'
import { EClassError } from '../utils'
import { throwCustomError } from '../utils/errors'

/** mock error generation to validate signature */
jest.mock('../utils/errors')

throwCustomError.mockImplementation((error) => {
  throw error
})

describe('validateCreateTalent', () => {
  const methodPath = 'business.talent.validateCreateTalent'
  /**
   * @constant
   * @type {MutateTalentInputCreate}
   */
  const validateCaseDefault = {
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

  test('validate default case', () => {
    expect(validateCreateTalent(validateCaseDefault)).toMatchObject({
      ...validateCaseDefault
    })
  })

  /**
   * @constant
   * @type {MutateTalentInputCreate}
   */
  const validateCaseStatusInvalid = {
    ...validateCaseDefault,
    talentStatus: 'INVALID'
  }

  test('validate invalid talentStatus', () => {
    const throwMessage = `invalid value for talentStatus: got ${validateCaseStatusInvalid.talentStatus}`
    expect(() => {
      validateCreateTalent(validateCaseStatusInvalid)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  /**
   * @constant
   * @type {MutateTalentInputCreate}
   */
  const validateCaseSalaryRangeInvalid = {
    ...validateCaseDefault,
    talentLastSalaryRange: 'INVALID'
  }

  test('validate invalid talentLastSalaryRange on create', () => {
    const throwMessage = `invalid value for talentLastSalaryRange: got ${validateCaseSalaryRangeInvalid.talentLastSalaryRange}`
    expect(() => {
      validateCreateTalent(validateCaseSalaryRangeInvalid)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  /**
   * @constant
   * @type {MutateTalentInputCreate}
   */
  const validateNullTalentName = {
    ...validateCaseDefault,
    talentName: null
  }

  test('validate null talentName on create', () => {
    const throwMessage = 'invalid entry on field data, missing information about talentName'
    expect(() => {
      validateCreateTalent(validateNullTalentName)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  /**
   * @constant
   * @type {MutateTalentInputCreate}
   */
  const validateNullTalentSurname = {
    ...validateCaseDefault,
    talentSurname: null
  }

  test('validate null talentSurname on create', () => {
    const throwMessage = 'invalid entry on field data, missing information about talentSurname'
    expect(() => {
      validateCreateTalent(validateNullTalentSurname)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  /**
   * @constant
   * @type {MutateTalentInputCreate}
   */
  const validateNullTalentEconomicSegment = {
    ...validateCaseDefault,
    talentEconomicSegment: null
  }

  test('validate null talentEconomicSegment on create', () => {
    const throwMessage = 'invalid entry on field data, missing information about talentEconomicSegment'
    expect(() => {
      validateCreateTalent(validateNullTalentEconomicSegment)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  const validateNullData = null

  test('validate null data on create', () => {
    const throwMessage = 'invalid entry on field data, missing information'
    expect(() => {
      validateCreateTalent(validateNullData)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  const invalidArrayStrings = [[1, 's'], null, 's', 1, undefined, {}]
  const validArrayStrings = [[], ['a', 'b', 'c']]

  invalidArrayStrings.forEach((value) => {
    /**
     * @constant
     * @type {MutateTalentInputCreate}
     */
    const caseToValidateHardSkillsArrayTags = {
      ...validateCaseDefault,
      talentHardSkillsTags: value
    }
    test(`(invalid arrays) validate talentHardSkillsTags data content on create "${JSON.stringify(value)}"`, () => {
      const throwMessage = 'invalid value for talentHardSkillsTags'
      expect(() => {
        validateCreateTalent(caseToValidateHardSkillsArrayTags)
      }).toThrow(throwMessage)
      // throws correct message
      expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
    })

    /**
     * @constant
     * @type {MutateTalentInputCreate}
     */
    const caseToValidateSoftSkillsArrayTags = {
      ...validateCaseDefault,
      talentSoftSkillsTags: value
    }
    test(`(invalid arrays) validate talentSoftSkillsTags data content on create "${JSON.stringify(value)}"`, () => {
      const throwMessage = 'invalid value for talentSoftSkillsTags'
      expect(() => {
        validateCreateTalent(caseToValidateSoftSkillsArrayTags)
      }).toThrow(throwMessage)
      // throws correct message
      expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
    })

    /**
     * @constant
     * @type {MutateTalentInputCreate}
     */
    const caseToValidatePositionArrayTags = {
      ...validateCaseDefault,
      talentPositionTags: value
    }
    test(`(invalid arrays) validate talentPositionTags data content on create "${JSON.stringify(value)}"`, () => {
      const throwMessage = 'invalid value for talentPositionTags'
      expect(() => {
        validateCreateTalent(caseToValidatePositionArrayTags)
      }).toThrow(throwMessage)
      // throws correct message
      expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
    })
  })

  validArrayStrings.forEach((value) => {
    /**
     * @constant
     * @type {MutateTalentInputCreate}
     */
    const caseToValidateHardSkillsArrayTags = {
      ...validateCaseDefault,
      talentHardSkillsTags: value
    }
    test(`(valid arrays) validate talentHardSkillsTags data content on create "${JSON.stringify(value)}"`, () => {
      expect(() => {
        validateCreateTalent(caseToValidateHardSkillsArrayTags)
      }).not.toThrow()
    })

    /**
     * @constant
     * @type {MutateTalentInputCreate}
     */
    const caseToValidateSoftSkillsArrayTags = {
      ...validateCaseDefault,
      talentSoftSkillsTags: value
    }
    test(`(valid arrays) validate talentSoftSkillsTags data content on create "${JSON.stringify(value)}"`, () => {
      expect(() => {
        validateCreateTalent(caseToValidateSoftSkillsArrayTags)
      }).not.toThrow()
    })

    /**
     * @constant
     * @type {MutateTalentInputCreate}
     */
    const caseToValidatePositionArrayTags = {
      ...validateCaseDefault,
      talentPositionTags: value
    }
    test(`(valid arrays) validate talentPositionTags data content on create "${JSON.stringify(value)}"`, () => {
      expect(() => {
        validateCreateTalent(caseToValidatePositionArrayTags)
      }).not.toThrow()
    })
  })
})

describe('validateUpdateTalent', () => {
  const methodPath = 'business.talent.validateUpdateTalent'
  const defaultOriginalData = validateCreateTalent({
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

  /**
   * @constant
   * @type {MutateTalentInputUpdate}
   */
  const validateCaseDefaultUpdate = {
    ...defaultOriginalData,
    talentSurname: 'updated data',
    talentStatus: ETalentStatus.CLOSED
  }

  test('validate null originalData on update', () => {
    const throwMessage = 'no data for this id'
    expect(() => {
      validateUpdateTalent(validateCaseDefaultUpdate)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  test('validate data when is null for update', () => {
    const throwMessage = 'invalid entry on field data, missing information'
    expect(() => {
      validateUpdateTalent(null, defaultOriginalData)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  test('validate normal update', () => {
    const updatedData = validateUpdateTalent(validateCaseDefaultUpdate, defaultOriginalData, 'testUser')
    expect(updatedData)
      .toMatchObject({
        talentSurname: 'updated data',
        talentStatus: ETalentStatus.CLOSED
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
   * @type {MutateTalentInputUpdate}
   */
  const validateCaseStatusInvalid = {
    ...defaultOriginalData,
    talentStatus: 'INVALID'
  }

  test('validate invalid talentStatus', () => {
    const throwMessage = `invalid value for talentStatus: got ${validateCaseStatusInvalid.talentStatus}`
    expect(() => {
      validateUpdateTalent(validateCaseStatusInvalid, defaultOriginalData)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  /**
   * @constant
   * @type {MutateTalentInputUpdate}
   */
  const validateCaseSalaryRangeInvalid = {
    ...defaultOriginalData,
    talentLastSalaryRange: 'INVALID'
  }

  test('validate invalid talentLastSalaryRange on create', () => {
    const throwMessage = `invalid value for talentLastSalaryRange: got ${validateCaseSalaryRangeInvalid.talentLastSalaryRange}`
    expect(() => {
      validateUpdateTalent(validateCaseSalaryRangeInvalid, defaultOriginalData)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  /**
   * @constant
   * @type {MutateTalentInputUpdate}
   */
  const validateNullTalentName = {
    ...defaultOriginalData,
    talentName: null
  }

  test('validate null talentName on create', () => {
    const throwMessage = 'invalid entry on field data, missing information about talentName'
    expect(() => {
      validateUpdateTalent(validateNullTalentName, defaultOriginalData)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  /**
   * @constant
   * @type {MutateTalentInputUpdate}
   */
  const validateNullTalentSurname = {
    ...defaultOriginalData,
    talentSurname: null
  }

  test('validate null talentSurname on create', () => {
    const throwMessage = 'invalid entry on field data, missing information about talentSurname'
    expect(() => {
      validateUpdateTalent(validateNullTalentSurname, defaultOriginalData)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  const invalidArrayStrings = [[1, 's'], null, 's', 1, undefined, {}]
  const validArrayStrings = [[], ['a', 'b', 'c']]

  invalidArrayStrings.forEach((value) => {
    /**
     * @constant
     * @type {MutateTalentInputUpdate}
     */
    const caseToValidateHardSkillsArrayTags = {
      ...defaultOriginalData,
      talentHardSkillsTags: value
    }
    test(`(invalid arrays) validate talentHardSkillsTags data content on create "${JSON.stringify(value)}"`, () => {
      const throwMessage = 'invalid value for talentHardSkillsTags'
      expect(() => {
        validateUpdateTalent(caseToValidateHardSkillsArrayTags, defaultOriginalData)
      }).toThrow(throwMessage)
      // throws correct message
      expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
    })

    /**
     * @constant
     * @type {MutateTalentInputUpdate}
     */
    const caseToValidateSoftSkillsArrayTags = {
      ...defaultOriginalData,
      talentSoftSkillsTags: value
    }
    test(`(invalid arrays) validate talentSoftSkillsTags data content on create "${JSON.stringify(value)}"`, () => {
      const throwMessage = 'invalid value for talentSoftSkillsTags'
      expect(() => {
        validateUpdateTalent(caseToValidateSoftSkillsArrayTags, defaultOriginalData)
      }).toThrow(throwMessage)
      // throws correct message
      expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
    })

    /**
     * @constant
     * @type {MutateTalentInputUpdate}
     */
    const caseToValidatePositionArrayTags = {
      ...defaultOriginalData,
      talentPositionTags: value
    }
    test(`(invalid arrays) validate talentPositionTags data content on create "${JSON.stringify(value)}"`, () => {
      const throwMessage = 'invalid value for talentPositionTags'
      expect(() => {
        validateUpdateTalent(caseToValidatePositionArrayTags, defaultOriginalData)
      }).toThrow(throwMessage)
      // throws correct message
      expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
    })
  })

  validArrayStrings.forEach((value) => {
    /**
     * @constant
     * @type {MutateTalentInputUpdate}
     */
    const caseToValidateHardSkillsArrayTags = {
      ...defaultOriginalData,
      talentHardSkillsTags: value
    }
    test(`(valid arrays) validate talentHardSkillsTags data content on create "${JSON.stringify(value)}"`, () => {
      expect(() => {
        validateUpdateTalent(caseToValidateHardSkillsArrayTags, defaultOriginalData)
      }).not.toThrow()
    })

    /**
     * @constant
     * @type {MutateTalentInputUpdate}
     */
    const caseToValidateSoftSkillsArrayTags = {
      ...defaultOriginalData,
      talentSoftSkillsTags: value
    }
    test(`(valid arrays) validate talentSoftSkillsTags data content on create "${JSON.stringify(value)}"`, () => {
      expect(() => {
        validateUpdateTalent(caseToValidateSoftSkillsArrayTags, defaultOriginalData)
      }).not.toThrow()
    })

    /**
     * @constant
     * @type {MutateTalentInputUpdate}
     */
    const caseToValidatePositionArrayTags = {
      ...defaultOriginalData,
      talentPositionTags: value
    }
    test(`(valid arrays) validate talentPositionTags data content on create "${JSON.stringify(value)}"`, () => {
      expect(() => {
        validateUpdateTalent(caseToValidatePositionArrayTags, defaultOriginalData)
      }).not.toThrow()
    })
  })
})

describe('validateDeleteTalent', () => {
  const methodPath = 'business.talent.validateDeleteTalent'
  const defaultOriginalData = validateCreateTalent({
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

  test('validate null originalData on update', () => {
    const throwMessage = 'no data for this id'
    expect(() => {
      validateDeleteTalent(null)
    }).toThrow(throwMessage)
    // throws correct message
    expect(throwCustomError).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.USER_ERROR)
  })

  test('validate normal delete', () => {
    expect(validateDeleteTalent(defaultOriginalData))
      .toMatchObject(defaultOriginalData)
  })
})
