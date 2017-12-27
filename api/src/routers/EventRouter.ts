import { Request, Response, NextFunction, RequestHandler, Router } from 'express'
import * as passport from 'passport'
import '../config/passport/consumer'

import { CONST } from '../../../common'

import * as ContentController from '../controllers/ContentController'


import { Schema, Types } from 'mongoose'

import * as validator from 'validator'
import '../config/passport/consumer'

import { CONFIG, ERRORS, UTIL } from '../../../common'
import { Logger, Err } from '../modules'

import Processor from '../modules/process'
import Process, { IProcess } from '../models/workflow/ProcessModel'
import Activity, { IActivity }  from '../models/workflow/ActivityModel'

import Consumer from '../models/users/ConsumerModel'
import IUser from '../interfaces/users/IUser'

import Event, { IEvent } from '../models/event/EventModel'

/**
 * EventRouter class
 *
 * @class EventRouter
 */
class EventRouter {
  router: Router

  /**
   * Constructor
   *
   * @class EventRouter
   * @constructor
   */
  constructor() {
    this.router = Router()
  }

  /**
   * Middleware to set route variables
   *
   * @method setRouteVar
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {void}
   */
  private setRouteVar: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    req.routeVar = {
      creatorType: CONST.USER_TYPES.CONSUMER,
      userHandleKey: 'organizer',
      contentType: CONST.ACTION_TARGETS.EVENT,
      contentCounter: 'eventCount',
      keywordFields: 'title excerpt content destination'
    }

    next()
  }

  routes() {
    ContentController.createRoutes(this.router, passport.authenticate('consumerJwt', {
      session: false
    }), this.setRouteVar)
  }
}

// export
const eventRouter = new EventRouter()
eventRouter.routes()
const thisRouter = eventRouter.router

export default thisRouter
