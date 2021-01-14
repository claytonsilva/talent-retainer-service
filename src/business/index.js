/**
 * Business  Namespace.
 * @namespace business
 *
 *
 * @description this namespace control all business control of the solution
 */
/**
 * code imports
 */
// eslint-disable-next-line no-unused-vars
import { ETalentRangeSalary, ETalentStatus, EOpeningStatus } from './constants'

/***
 * TALENT INFORMATION
 */

/**
 * @typedef {Object} TalentKey
 * @property {string} talentEconomicSegment economic segment of the talent
 * @property {string} id  id of the talent
 */

/***
 * TALENTS MODELS
 */

/**
* @typedef {Object} Talent
* @property {string} id  id of the task
* @property {string} talentEconomicSegment economic segment of the talent
* @property {string} talentName name of the talent
* @property {user} talentSurname surname of the talent
* @property {string} talentResume resume of the talent, extracted from linkedin
* @property {Array<string>} talentSoftSkillsTags list of softskills tags
* @property {Array<string>} talentHardSkillsTags list of hardskills tags
* @property {Array<string>} talentPositionTags list of positions tags (all positions works in the resume)
* @property {ETalentStatus} talentStatus status of the talent (if is open for new offers in match)
* @property {ETalentRangeSalary} talentLastSalaryRange salary range of the last (or actual) position of the talent
* @property {string} creationDate datetime of creation
* @property {string} lastUpdateDate datetime of the last update
*/

/**
* @typedef {Object} MutateTalentInputCreate  object to input in mutations
* @property {string} talentEconomicSegment economic segment of the talent
* @property {string} talentName name of the talent
* @property {user} talentSurname surname of the talent
* @property {string} talentResume resume of the talent, extracted from linkedin
* @property {Array<string>} talentSoftSkillsTags list of softskills tags
* @property {Array<string>} talentHardSkillsTags list of hardskills tags
* @property {Array<string>} talentPositionTags list of positions tags (all positions works in the resume)
* @property {ETalentStatus} talentStatus status of the talent (if is open for new offers in match)
* @property {ETalentRangeSalary} talentLastSalaryRange salary range of the last (or actual) position of the talent
*/

/**
* @typedef {Object} MutateTalentInputUpdate  object to input in mutations
* @property {string} talentName name of the talent
* @property {user} talentSurname surname of the talent
* @property {string} talentResume resume of the talent, extracted from linkedin
* @property {Array<string>} talentSoftSkillsTags list of softskills tags
* @property {Array<string>} talentHardSkillsTags list of hardskills tags
* @property {Array<string>} talentPositionTags list of positions tags (all positions works in the resume)
* @property {ETalentStatus} talentStatus status of the talent (if is open for new offers in match)
* @property {ETalentRangeSalary} talentLastSalaryRange salary range of the last (or actual) position of the talent
*/

/***
 * OPENINGS MODELS
 */

/**
* @typedef {Object} Opening
* @property {string} id  id of the task
* @property {string} openingEconomicSegment economic segment of the open job
* @property {string} openingCompanyName name of the company
* @property {user} openingJobName name of the job title
* @property {string} openingResume resume of the job
* @property {Array<string>} openingSoftSkillsTags list of softskills tags
* @property {Array<string>} openingHardSkillsTags list of hardskills tags
* @property {Array<string>} openingPositionTags list of positions tags (all positions to match with talent)
* @property {ETalentStatus} openingStatus status of the opening
* @property {ETalentRangeSalary} openingRangeSalary salary range of the job opportunity
* @property {string} creationDate datetime of creation
* @property {string} lastUpdateDate datetime of the last update
*/

/**
* @typedef {Object} MutateOPeningInputCreate  object to input in create mutations
* @property {string} openingEconomicSegment economic segment of the open job
* @property {string} openingCompanyName name of the company
* @property {user} openingJobName name of the job title
* @property {string} openingResume resume of the job
* @property {Array<string>} openingSoftSkillsTags list of softskills tags
* @property {Array<string>} openingHardSkillsTags list of hardskills tags
* @property {Array<string>} openingPositionTags list of positions tags (all positions to match with talent)
* @property {EOpeningStatus} openingStatus status of the opening
* @property {ETalentRangeSalary} openingRangeSalary salary range of the job opportunity
*/

/**
* @typedef {Object} MutateOPeningInputUpdate  object to input in update mutations
* @property {string} openingCompanyName name of the company
* @property {user} openingJobName name of the job title
* @property {string} openingResume resume of the job
* @property {Array<string>} openingSoftSkillsTags list of softskills tags
* @property {Array<string>} openingHardSkillsTags list of hardskills tags
* @property {Array<string>} openingPositionTags list of positions tags (all positions to match with talent)
* @property {EOpeningStatus} openingStatus status of the opening
* @property {ETalentRangeSalary} openingRangeSalary salary range of the job opportunity
*/
