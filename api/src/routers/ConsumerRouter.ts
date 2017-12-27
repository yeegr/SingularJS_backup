import { Request, Response, NextFunction, RequestHandler, Router } from 'express'
import * as moment from 'moment-timezone'
import * as passport from 'passport'
import '../config/passport/consumer'

import { CONFIG, CONST } from '../../../common/'

import Consumer, { IConsumer } from '../models/users/ConsumerModel'
import * as UserController from '../controllers/UserController'

/**
 * ConsumerRouter class
 *
 * @class ConsumerRouter
 */
class ConsumerRouter {
  router: Router

  /**
   * Constructor
   *
   * @class ConsumerRouter
   * @constructor
   */
  constructor() {
    this.router = Router()
  }

  /**
   * Gets single entry by param of 'handle', 
   * without private information
   *
   * @class ConsumerRouter
   * @method get
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public get = (req: Request, res: Response): void => {
    Consumer
    .findOneAndUpdate({
      handle: req.params.handle
    }, {$inc: {viewCount: 1}}, {new: true})
    .select(CONST.PUBLIC_CONSUMER_INFO)
    .populate({
      path: 'posts',
      model: CONST.ACTION_TARGETS.POST,
      options: {
        find: {
          // 'status': CONST.STATUSES.CONTENT.APPROVED,
          // 'publish': {$lte: moment()}
        },
        sort: {
          'viewCount': -1,
          '_id': -1
        },
        limit: CONST.CONSUMER_POST_SHOWCASE_COUNT,
        select: CONST.CONSUMER_POST_SHOWCASE_KEYS
      },
    })
    .populate({
      path: 'events',
      model: CONST.ACTION_TARGETS.EVENT,
      options: {
        find: {
          'status': CONST.STATUSES.CONTENT.APPROVED,
          // 'publish': {$lte: moment()}
        },
        sort: {
          'viewCount': -1,
          '_id': -1
        },
        limit: CONST.CONSUMER_EVENT_SHOWCASE_COUNT,
        select: CONST.CONSUMER_EVENT_SHOWCASE_KEYS
      },
    })
    .lean()
    .then((user: IConsumer) => {
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
      userType: CONST.USER_TYPES.CONSUMER
    }

    next()
  }

  routes() {
    UserController.createRoutes(this.router, this.setRouteVar, passport.authenticate('consumerJwt', {
      session: false
    }))

    // list route
    this.router.get('/users/:handle', this.get)
  }
}

// export
const consumerRouter = new ConsumerRouter()
consumerRouter.routes()
const thisRouter = consumerRouter.router

export default thisRouter
