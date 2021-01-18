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
import { DynamoRepositoryInstance, QueueRepositoryInstance, EventRepositoryInstance } from '../ports/state-machines'
// code imports
import talentAdapterFactory,
// eslint-disable-next-line no-unused-vars
{ TalentAdapter } from './talent'

import { EPersistOperation } from '../business/constants'

import openingAdapterFactory,
// eslint-disable-next-line no-unused-vars
{ OpeningAdapter } from './opening'

/**
 * @description dynamo repository for state machine
 *
 * @memberof ports/state-machines
 * @function
 * @param {Logger} escriba - Instance of escriba.
 * @param {DynamoRepositoryInstance} talentRepository repository instatiated for talent table
 * @param {QueueRepositoryInstance} queueTalentRepository repository instatiated for talent queue
 * @param {EventRepositoryInstance} eventTalentRepository repository instatiated for talent events
 * @param {DynamoRepositoryInstance} openingRepository repository instatiated for opening table
 * @param {QueueRepositoryInstance} queueOpeningRepository repository instatiated for opening table queue
 * @param {EventRepositoryInstance} eventOpeningRepository repository instatiated for talent events
 * @param {EPersistOperation} persistOperation option for persist operation (validate/all) = default ALL
 * @returns {Adapter}
 */
export const adapter = (escriba, talentRepository, queueTalentRepository, eventTalentRepository, openingRepository, queueOpeningRepository, eventOpeningRepository, persistOperation = EPersistOperation.ALL) => {
  return {
    talent: talentAdapterFactory(escriba, talentRepository, queueTalentRepository, eventTalentRepository, persistOperation),
    opening: openingAdapterFactory(escriba, openingRepository, queueOpeningRepository, eventOpeningRepository, persistOperation)
  }
}
