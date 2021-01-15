/**
 * Adapters  Namespace.
 * @namespace adapters
 *
 *
 * @description this namespace control communication between business and state-machines
 */

/**
 * @typedef {Object} Adapter
 * @property {TalentAdapter} talent talent adapter instantied
 * @property {OpeningAdapter} opening talent adapter instantied
 */

// eslint-disable-next-line no-unused-vars
import { DynamoRepositoryInstance } from '../ports/state-machines'
// code imports
import talentAdapterFactory,
// eslint-disable-next-line no-unused-vars
{ TalentAdapter } from './talent'

import openingAdapterFactory,
// eslint-disable-next-line no-unused-vars
{ OpeningAdapter } from './opening'

/**
 * @description dynamo repository for state machine
 *
 * @memberof ports/state-machines
 * @function
 * @param {Logger} escriba - Instance of escriba.
 * @param {DynamoRepositoryInstance} talentRepository repository instatiated for talent
 * @param {DynamoRepositoryInstance} openingRepository repository instatiated for talent
 * @returns {Adapter}
 */
export const adapter = (escriba, talentRepository, openingRepository) => {
  return {
    talent: talentAdapterFactory(escriba, talentRepository),
    opening: openingAdapterFactory(escriba, openingRepository)
  }
}
