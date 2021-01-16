/**
 * Enum for ETalentStatus values.
 * @readonly
 * @memberof business
 * @enum {string}
 */
export const ETalentStatus = {
  OPEN: 'OPEN', // without job position and looking for jobs
  LOOKING: 'LOOKING', // with active job, but looking for better jobs
  CLOSED: 'CLOSED' // with/without active job, but cannot receive more invites
}

/**
 * Enum for ETalentRangeSalary values.
 * @readonly
 * @memberof business
 * @enum {string}
 */
export const ETalentRangeSalary = {
  NONE: 'NONE', // information cannot be extracted
  LOWER5K: 'LOWER5K', // < 5.000 of salary
  BETWEEN5KAND10K: 'BETWEEN5KAND10K', // between 5.000 and 10.000 of salary
  BETWEEN10KAND15K: 'BETWEEN10KAND15K', // between 10.000 and 15.000 of salary
  HIGHER15K: 'HIGHER15K' // > 15.000 of salary
}

/**
 * Enum for EOpeningStatus values.
 * @readonly
 * @memberof business
 * @enum {string}
 */
export const EOpeningStatus = {
  OPEN: 'OPEN', // open for matching
  SUSPENDED: 'SUSPENDED', // temporary suspended
  CLOSED: 'CLOSED' // the job position was filled or job position was canceled
}

/**
 * Enum for EOperation values.
 * @readonly
 * @memberof business
 * @enum {string}
 */
export const EOperation = {
  CREATE: 'CREATE', // create data in dynamo database
  UPDATE: 'UPDATE', // update data in dynamo database
  DELETE: 'DELETE', // delete data in dynamo database
  MATCH: 'MATCH' // match between talents and openings
}
