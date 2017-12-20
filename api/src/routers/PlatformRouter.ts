import { NextFunction, Request, Response, RequestHandler, Router } from 'express'
import * as moment from 'moment-timezone'
import * as passport from 'passport'
import '../config/passport/platform'

import { CONFIG, CONST, ERRORS, UTIL } from '../../../common'
import { Logger, Err } from '../modules'

import Platform, { IPlatform } from '../models/users/PlatformModel'
import Totp, { ITotp } from '../models/users/TotpModel'

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
    this.routes()
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
   * Creates a single user with username/password
   *
   * @class PlatformRouter
   * @method create
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public create = (req: Request, res: Response): void => {
    let body: any = req.body,
      username: string = body.username,
      password: string = body.password

    if (!body.hasOwnProperty('username') || !UTIL.validateUsername(username)) {
      res.status(401).json({ message: ERRORS.USER.MISSING_CREDENTIALS })      
    } else if (!body.hasOwnProperty('password') || !UTIL.validatePassword(password)) {
      res.status(401).json({ message: ERRORS.USER.VALID_PASSWORD_REQUIRED })
    } else {
      let user: IPlatform = new Platform({
          username,
          password,
          status: 'active'  // to be removed
        })

      this.createUser(user, req, res)
    }
  }
  
  /**
   * Creates a single user
   * 
   * @param {IPlatform} user 
   * @param {Request} req 
   * @param {Response} res 
   */
  public createUser(user: IPlatform, req: Request, res: Response): void {
    let log = {
      creatorRef: CONST.USER_TYPES.PLATFORM,
      action: CONST.USER_ACTIONS.COMMON.CREATE,
      ua: req.body.ua || req.ua
    }

    user
    .save()
    .then((data: IPlatform) => {
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
   * Login via username/password
   *
   * @class PlatformRouter
   * @method local
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {void}
   */
  public local = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate('platformLocal', {
      session: false,
      badRequestMessage: ERRORS.USER.MISSING_CREDENTIALS
    }, (err: Error, user: IPlatform, info: object) => {
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
  
        Platform
        .findOne(query)
        .then((user: IPlatform) => {
          if (user) {
            res.status(200).json(UTIL.getSignedUser(user))
          } else {
            res.status(404).json({ message: ERRORS.USER.USER_NOT_FOUND })
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
      userType: CONST.USER_TYPES.PLATFORM
    }

    next()
  }

  routes() {
    UserController.createRoutes(this.router, passport.authenticate('platformJwt', {
      session: false
    }), this.setRouteVar)

    // this.router.get('/users', this.setRouteVar, UserController.list)
    this.router.get('/users/:username', this.get)
    
    // create route
    this.router.post('/users/', this.create)
    
    // local login route via username/password
    this.router.post('/login/local', this.local, UserController.login)

    // login routes via TOTP
    this.router.patch('/login/totp', this.verifyTotp)
  }
}

// export
const platformRouter = new PlatformRouter()
platformRouter.routes()
const thisRouter = platformRouter.router

export default thisRouter
