import { Request, Response, NextFunction, RequestHandler, Router } from 'express'
import * as moment from 'moment-timezone'
import * as passport from 'passport'
import '../config/passport/platform'

import { CONFIG, CONST } from '../../../common'

import Platform, { IPlatform } from '../models/users/PlatformModel'
import * as UserController from '../controllers/UserController'

/**
 * PlatformRouter class
 *
 * @class PlatformRouter
 */
class PlatformRouter {
  router: Router

  /**
   * Constructor
   *
   * @class PlatformRouter
   * @constructor
   */
  constructor() {
    this.router = Router()
  }

  /**
   * Gets single entry by param of 'handle', 
   * without private information
   *
   * @class PlatformRouter
   * @method get
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public get = (req: Request, res: Response): void => {
    Platform
    .findOne({handle: req.params.handle})
    .lean()
    .then((user: IPlatform) => {
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).send()
      }
    })
    .catch((err: Error) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
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
  private setRouteVar: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    req.routeVar = {
      userType: CONST.USER_TYPES.PLATFORM
    }

    next()
  }

  routes() {
    UserController.createRoutes(this.router, this.setRouteVar, passport.authenticate('platformJwt', {
      session: false
    }))

    // this.router.get('/users', this.setRouteVar, UserController.list)
    this.router.get('/users/:username', this.get)
  }
}

// export
const platformRouter = new PlatformRouter()
platformRouter.routes()
const thisRouter = platformRouter.router

export default thisRouter
