/**
 * Reference only imports (for documentation).
 */
// eslint-disable-next-line no-unused-vars
import { Logger } from 'log4js'
// eslint-disable-next-line no-unused-vars
import { Adapter } from '../../../adapters/index'

/**
 * Code imports.
 */
import { Router } from 'express'
import { response } from './utils'
import { getTalent, createTalent, updateTalent, deleteTalent } from '../controllers/talent.controller'

const router = Router()

/**
 * @description Define the talent routes.
 *
 * @memberof ports/http/routes
 * @function
 * @param {Logger} escriba instance of escriba
 * @param {Adapter} adapter instantiated adapter
 * @returns {Router}
 */

export const talentRouter = (escriba, adapter) => {
  /**
   * get task with existing id
   */
  router.get('/:talentEconomicSegment/:id', (req, res, next) => response(getTalent(escriba, adapter)(req, res, next), res, next))

  /**
   * create task with existing id
   */
  router.post('/', (req, res, next) => response(createTalent(escriba, adapter)(req, res, next), res, next))

  /**
   * update task with existing id
   */
  router.put('/:talentEconomicSegment/:id', (req, res, next) => response(updateTalent(escriba, adapter)(req, res, next), res, next))

  /**
   * delete task with existing id
   */
  router.delete('/:talentEconomicSegment/:id', (req, res, next) => response(deleteTalent(escriba, adapter)(req, res, next), res, next))

  return router
}
