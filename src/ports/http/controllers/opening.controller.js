// eslint-disable-next-line no-unused-vars
import { Logger } from 'log4js'
// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express'
// eslint-disable-next-line no-unused-vars
import { Todo } from '../../../business'
// eslint-disable-next-line no-unused-vars
import { Adapter } from '../../../adapters'
// eslint-disable-next-line no-unused-vars
import { ControllerOpeningReturn } from './index'

/**
 * @description Get Opening by id
 *
 * @memberof ports/http/controllers
 * @param {Logger} escriba instance of escriba
 * @param {Adapter} adapter adapter instantiated
 * @returns {ControllerOpeningReturn}
 */
export const getOpening = (escriba, adapter) => async (req, _res, _next) => {
  try {
    /**
     * disclaimer : the user in production environment,
     * user will be sent by the midlleware authentication who call the method on http
     */
    const opening = await adapter.opening.getOpening(req.params.id, req.params.openingEconomicSegment)
    return opening
  } catch (error) {
    escriba.error('api.controller.opening.getOpening', error)
    throw error
  }
}

/**
 * @description Create Opening
 *
 * @memberof ports/http/controllers
 * @param {Logger} escriba instance of escriba
 * @param {Adapter} adapter adapter instantiated
 * @returns {ControllerOpeningReturn}
 */
export const createOpening = (escriba, adapter) => async (req, _res, _next) => {
  try {
    /**
     * TODO validate body
     */

    /**
     * disclaimer : the user in production environment,
     * user will be sent by the midlleware authentication who call the method on http
     */
    const opening = await adapter.opening.createOpening(req.body.data)
    return opening
  } catch (error) {
    escriba.error('api.controller.opening.createOpening', error)
    throw error
  }
}

/**
 * @description Update Opening
 *
 * @memberof ports/http/controllers
 * @param {Logger} escriba instance of escriba
 * @param {Adapter} adapter adapter instantiated
 * @returns {ControllerOpeningReturn}
 */
export const updateOpening = (escriba, adapter) => async (req, _res, _next) => {
  try {
    /**
     * TODO validate body
     */

    /**
     * disclaimer : the user in production environment,
     * user will be sent by the midlleware authentication who call the method on http
     */
    const opening = await adapter.opening.updateOpening(req.params.id, req.params.openingEconomicSegment, req.body.data)
    return opening
  } catch (error) {
    escriba.error('api.controller.opening.updateOpening', error)
    throw error
  }
}

/**
 * @description Delete Opening
 *
 * @memberof ports/http/controllers
 * @param {Logger} escriba instance of escriba
 * @param {Adapter} adapter adapter instantiated
 * @returns {ControllerOpeningReturn}
 */
export const deleteOpening = (escriba, adapter) => async (req, _res, _next) => {
  try {
    /**
     * disclaimer : the user in production environment,
     * user will be sent by the midlleware authentication who call the method on http
     */
    const opening = await adapter.opening.deleteOpening(req.params.id, req.params.openingEconomicSegment)
    return opening
  } catch (error) {
    escriba.error('api.controller.opening.deleteOpening', error)
    throw error
  }
}
