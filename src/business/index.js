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
import { ETalentRangeSalary, ETalentStatus } from './constants'

/***
 * TALENT INFORMATION
 */

/**
 * @typedef {Object} TalentKey
 * @property {string} talentEconomicSegment economic segment of the talent
 * @property {string} id  id of the talent
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
