// eslint-disable-next-line no-unused-vars
import { Logger } from 'log4js'
// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express'
// eslint-disable-next-line no-unused-vars
import { Todo } from '../../../business'
// eslint-disable-next-line no-unused-vars
import { Adapter } from '../../../adapters'
// eslint-disable-next-line no-unused-vars
import { ControllerTalentReturn } from './index'

/**
 * @description Get Talent by id
 *
 * @memberof ports/http/controllers
 * @param {Logger} escriba instance of escriba
 * @param {Adapter} adapter adapter instantiated
 * @returns {ControllerTalentReturn}
 */
export const getTalent = (escriba, adapter) => async (req, _res, _next) => {
  try {
    /**
     * disclaimer : the user in production environment,
     * user will be sent by the midlleware authentication who call the method on http
     */
    const talent = await adapter.talent.getTalent(req.params.id, req.params.talentEconomicSegment)
    return talent
  } catch (error) {
    escriba.error('api.controller.talent.getTalent', error)
    throw error
  }
}

/**
 * @description Create Talent
 *
 * @memberof ports/http/controllers
 * @param {Logger} escriba instance of escriba
 * @param {Adapter} adapter adapter instantiated
 * @returns {ControllerTalentReturn}
 */
export const createTalent = (escriba, adapter) => async (req, _res, _next) => {
  try {
    /**
     * TODO validate body
     */

    /**
     * disclaimer : the user in production environment,
     * user will be sent by the midlleware authentication who call the method on http
     */
    const talent = await adapter.talent.createTalent(req.body.data)
    return talent
  } catch (error) {
    escriba.error('api.controller.talent.createTalent', error)
    throw error
  }
}

/**
 * @description Update Talent
 *
 * @memberof ports/http/controllers
 * @param {Logger} escriba instance of escriba
 * @param {Adapter} adapter adapter instantiated
 * @returns {ControllerTalentReturn}
 */
export const updateTalent = (escriba, adapter) => async (req, _res, _next) => {
  try {
    /**
     * TODO validate body
     */

    /**
     * disclaimer : the user in production environment,
     * user will be sent by the midlleware authentication who call the method on http
     */
    const talent = await adapter.talent.updateTalent(req.params.id, req.params.talentEconomicSegment, req.body.data)
    return talent
  } catch (error) {
    escriba.error('api.controller.talent.updateTalent', error)
    throw error
  }
}

/**
 * @description Delete Talent
 *
 * @memberof ports/http/controllers
 * @param {Logger} escriba instance of escriba
 * @param {Adapter} adapter adapter instantiated
 * @returns {ControllerTalentReturn}
 */
export const deleteTalent = (escriba, adapter) => async (req, _res, _next) => {
  try {
    /**
     * disclaimer : the user in production environment,
     * user will be sent by the midlleware authentication who call the method on http
     */
    const todo = await adapter.talent.deleteTalent(req.params.id, req.params.talentEconomicSegment)
    return todo
  } catch (error) {
    escriba.error('api.controller.todo.deleteTalent', error)
    throw error
  }
}
