import { RequestHandler, Request, Response, NextFunction, Router } from 'express'
import * as passport from 'passport'
import '../config/passport/consumer'

import { CONST } from '../../../common'

import * as ContentController from '../controllers/ContentController'

/**
 * PostRouter class
 *
 * @class PostRouter
 */
class PostRouter {
  router: Router

  /**
   * Constructor
   *
   * @class PostRouter
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
      userHandleKey: 'author',
      contentType: CONST.ACTION_TARGETS.POST,
      contentCounter: 'postCount',
      keywordFields: 'title excerpt content'
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
const postRouter = new PostRouter()
postRouter.routes()
const thisRouter = postRouter.router

export default thisRouter
