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
import { getOpening, createOpening, updateOpening, deleteOpening } from '../controllers/opening.controller'

const router = Router()

/**
 * @description Define the opening routes.
 *
 * @memberof ports/http/routes
 * @function
 * @param {Logger} escriba instance of escriba
 * @param {Adapter} adapter instantiated adapter
 * @returns {Router}
 */

export const openingRouter = (escriba, adapter) => {
  /**
   * get task with existing id
   */
  router.get('/:id', (req, res, next) => response(getOpening(escriba, adapter)(req, res, next), res, next))

  /**
   * create task with existing id
   */
  router.post('/', (req, res, next) => response(createOpening(escriba, adapter)(req, res, next), res, next))

  /**
   * update task with existing id
   */
  router.put('/:id', (req, res, next) => response(updateOpening(escriba, adapter)(req, res, next), res, next))

  /**
   * delete task with existing id
   */
  router.delete('/:id', (req, res, next) => response(deleteOpening(escriba, adapter)(req, res, next), res, next))

  return router
}
