import { NextFunction, Request, Response, RequestHandler, Router } from 'express'
import * as moment from 'moment-timezone'
import * as passport from 'passport'
import '../config/passport/consumer'

import { CONFIG, CONST, ERRORS, UTIL } from '../../../common/'
import { Logger, Err } from '../modules'

import Consumer, { IConsumer } from '../models/users/ConsumerModel'
import Totp, { ITotp } from '../models/users/TotpModel'

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
    this.routes()
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
   * Creates a single user with handle/password
   *
   * @class ConsumerRouter
   * @method create
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public create = (req: Request, res: Response): void => {
    let body: any = req.body

    if (!body.hasOwnProperty('handle') || !UTIL.validateHandle(body.handle)) {
      res.status(401).json({ message: ERRORS.USER.MISSING_CREDENTIALS })      
    } else if (!body.hasOwnProperty('password') || !UTIL.validatePassword(body.password)) {
      res.status(401).json({ message: ERRORS.USER.VALID_PASSWORD_REQUIRED })
    } else {
      let user: IConsumer = new Consumer({
        handle: body.handle,
        password: body.password
      })

      this.createUser(user, req, res)
    }
  }
  
  /**
   * Creates a single user
   * 
   * @param {IConsumer} user 
   * @param {Request} req 
   * @param {Response} res 
   */
  private createUser(user: IConsumer, req: Request, res: Response): void {
    let log = {
      creatorRef: CONST.USER_TYPES.CONSUMER,
      action: CONST.USER_ACTIONS.COMMON.CREATE,
      ua: req.body.ua || req.ua
    }

    user
    .save()
    .then((data: IConsumer) => {
      res.status(201).json(UTIL.getSignedUser(data))

      new Logger(Object.assign({}, log, {
        creator: data._id,
      }))        
    })
    .catch((err: Error) => {
      new Err(res, err, log)
    })
  }

  /**
   * Login via handle/password
   *
   * @class ConsumerRouter
   * @method local
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {void}
   */
  public local = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate('consumerLocal', {
      session: false,
      badRequestMessage: ERRORS.USER.MISSING_CREDENTIALS
    }, (err: Error, user: IConsumer, info: object) => {
      if (err) {
        res.status(400).send(err) 
        return
      }

      if (!user) {
        res.status(401).send(info)
        return
      }

      req.user = user
      req.authInfo = 'local'

      next()
    })(req, res, next)
  }

  /**
   * Login via TOTP 
   *
   * @class ConsumerRouter
   * @method verifyTotp
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {void}
   */
  public verifyTotp = (req: Request, res: Response, next: NextFunction): void => {
    let query: any = req.body,
      now: number = moment().valueOf()

    query.verifiedAt = null

    Totp
    .findOne(query)
    .then((totp: ITotp) => {
      if (!totp) {
        res.status(400).json({ message: ERRORS.USER.NO_VALID_TOTP_ISSUED })
        return null    
      }
  
      if (totp.expireAt <= now) {
        res.status(400).json({ message: ERRORS.USER.TOTP_CODE_EXPIRED })
        return null
      }
  
      totp.verifiedAt = now        
      return totp.save()
    })
    .then((totp: ITotp) => {
      if (totp) {
        let query: any = {}
        
        switch (totp.type) {
          case CONST.TOTP_TYPES.SMS:
            query.mobile = totp.value
          break

          case CONST.TOTP_TYPES.EMAIL:
            query.email = totp.value
          break
        }
  
        Consumer
        .findOne(query)
        .then((user: IConsumer) => {
          if (user) {
            res.status(200).json(UTIL.getSignedUser(user))
          } else {
            // creates a new user if matching credentials not found
            let user: IConsumer = new Consumer(query)
            this.createUser(user, req, res)
          }
        })
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
    UserController.createRoutes(this.router, passport.authenticate('consumerJwt', {
      session: false
    }), this.setRouteVar)

    // list route
    this.router.get('/users/:handle', this.get)
    
    // create route
    this.router.post('/users', this.create)
    
    // local login route via user handle/password
    this.router.post('/login/local', this.local, UserController.login)

    // login routes via TOTP
    this.router.patch('/login/totp', this.verifyTotp)
  }
}

// export
const consumerRouter = new ConsumerRouter()
consumerRouter.routes()
const thisRouter = consumerRouter.router

export default thisRouter
