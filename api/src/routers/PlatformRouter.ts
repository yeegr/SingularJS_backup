import { NextFunction, Request, Response, Router } from 'express'
import * as moment from 'moment'
import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'
import '../config/passport/platform'
import * as validator from 'validator'
import * as randomstring from 'randomstring'

import * as CONFIG from '../../../common/options/config'
import * as CONST from '../../../common/options/constants'
import * as ERR from '../../../common/options/errors'
import * as UTIL from '../../../common/util'
import Logger from '../modules/logger'
import Err from '../modules/err'

import Platform from '../models/users/PlatformModel'
import IPlatform from '../interfaces/users/IPlatform'

import Totp from '../models/TotpModel'
import ITotp from '../interfaces/ITotp'

import SMS from '../modules/sms'

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
   * List search results
   *
   * @class PlatformRouter
   * @method list
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public list = (req: Request, res: Response): void => {
    let params = UTIL.assembleSearchParams(req, {
      }, 'username, name')

    Platform
    .find(params.query)
    .skip(params.skip)
    .limit(params.limit)
    .sort(params.sort)
    .exec()
    .then((arr: IPlatform[]) => {
      if (arr) {
        res.status(200).json(arr)
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
   * Gets single entry by param of 'username', 
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
    .findOne({username: req.params.username})
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
   * Check if unique field is available to user
   *
   * @class PlatformRouter
   * @method unique
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public unique = (req: Request, res: Response): void => {
    let query = {},
      tuple: any = UTIL.kvp2tuple(req.body),
      key: string = tuple[0],
      value: any = tuple[1]

    if (key.length > 0 && value.length > 0) {
      switch (key) {
        case 'username':
        default:
          // validate user username
          if (UTIL.validateUsername(value)) {
            query = {username: value}
          }
        break
  
        case 'email':
          // validate email address
          if (validator.isEmail(value)) {
            query = {email: value}
          }
        break
  
        case 'mobile':
          value = UTIL.normalizeMobile(value)

          // validate mobile phone number
          if (validator.isMobilePhone(value, CONFIG.DEFAULT_LOCALE)) {
            query = {mobile: value}
          }
        break
      }

      Platform
      .findOne(query)
      .then((data: IPlatform) => {
        let isAvailable: boolean = !(data)
        res.status(200).json({isAvailable})
      })
      .catch((err: Error) => {
        res.status(res.statusCode).send()
        console.log(err)
      })
    }
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
      res.status(401).json({ message: ERR.USER.MISSING_CREDENTIALS })      
    } else if (!body.hasOwnProperty('password') || !UTIL.validatePassword(password)) {
      res.status(401).json({ message: ERR.USER.VALID_PASSWORD_REQUIRED })
    } else {
      let user: IPlatform = new Platform({
          username,
          password
        }),
        log = {
          action: CONST.USER_ACTIONS.COMMON.CREATE,
          type: CONST.ACTION_TARGETS.PLATFORM,
          ua: req.body.ua || req.ua
        }

      user
      .save()
      .then((data: IPlatform) => {
        res.status(201).json(UTIL.getSignedUser(data))
  
        new Logger(Object.assign({}, log, {
          creator: data._id,
          ref: CONST.USER_TYPES.PLATFORM,
          target: data._id
        }))     
      })
      .catch((err: Error) => {
        new Err(res, err, log)
      })
    }
  }
  
  /**
   * Updates entry by params of 'username'
   *
   * @class PlatformRouter
   * @method update
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public update = (req: Request, res: Response): void => {
    const username: string = req.params.username,
      _id: string = req.user._id
    
    if (username !== req.user.username) {
      res.status(401).json({ message: ERR.USER.PERMISSION_DENIED })
    } else {
      let log = {
        creator: _id,
        ref: CONST.USER_TYPES.PLATFORM,
        action: CONST.USER_ACTIONS.COMMON.UPDATE,
        type: CONST.ACTION_TARGETS.PLATFORM,
        target: _id,
        ua: req.body.ua || req.ua
      }

      Platform
      .findByIdAndUpdate(_id, req.body, {new: true})
      .then((user: IPlatform) => {
        if (user) {
          res.status(200).json(UTIL.getSignedUser(user))
          new Logger(log)
        } else {
          res.status(404).send()
        }
      })
      .catch((err: Error) => {
        new Err(res, err, log)
      })
    }
  }
  
  /**
   * Deletes entry by params of 'username'
   *
   * @class PlatformRouter
   * @method delete
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public delete = (req: Request, res: Response): void => {
    const username: string = req.params.username,
      _id: string = req.user._id
    
    if (username !== req.user.username) {
      res.status(401).json({ message: ERR.USER.PERMISSION_DENIED })
    } else {
      let log = {
        creator: _id,
        ref: CONST.USER_TYPES.PLATFORM,
        action: CONST.USER_ACTIONS.COMMON.DELETE,
        type: CONST.ACTION_TARGETS.PLATFORM,
        target: _id,
        ua: req.body.ua || req.ua
      }

      Platform
      .findByIdAndRemove(_id)
      .then((user: IPlatform) => {
        if (user) {
          res.status(204).end()
          new Logger(log)        
        } else {
          res.status(404).send()
        }
      })
      .catch((err: Error) => {
        new Err(res, err, log)
      })
    }
  }

  /**
   * Login user
   *
   * @class PlatformRouter
   * @method login
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public login = (req: Request, res: Response): void => {
    const user: IPlatform = req.user

    res.status(200).json(UTIL.getSignedUser(user))

    new Logger({
      creator: user._id,
      ref: CONST.USER_TYPES.PLATFORM,
      action: CONST.USER_ACTIONS.COMMON.LOGIN,
      type: CONST.ACTION_TARGETS.PLATFORM,
      target: user._id,
      misc: req.authInfo,
      ua: req.body.ua || req.ua
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
      badRequestMessage: ERR.USER.MISSING_CREDENTIALS
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
   * Gets user with populated sublist
   *
   * @class PlatformRouter
   * @method sublist
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public sublist = (req: Request, res: Response): void => {
    let username = req.params.username,
      id: string = req.user._id,
      path = req.params.sublist,
      model = UTIL.getModelFromPath(path),
      opt: any = UTIL.assembleSearchParams(req)

    if (username !== req.user.username) {
      res.status(422).json({ message: ERR.USER.PERMISSION_DENIED })
    } else {
      Platform
      .findOne({username})
      .select('_id username')
      .populate({
        path,
        model,
        options: {
          sort: opt.sort,
          limit: opt.limit,
          skip: opt.skip
        },
        populate: ({
          path: 'target'
        })
      })
      .exec()
      .then((data: IPlatform) => {
        if (data) {
          res.status(200).json(data)
        } else {
          res.status(404).send()
        }
      })
      .catch((err: Error) => {
        res.status(res.statusCode).send()
        console.log(err)
      })
    }
  }

  routes() {
    // list route
    this.router.get('/', this.list)
    this.router.get('/:username', this.get)
    
    // create route
    this.router.post('/', this.create)
    
    // route to check unique values
    this.router.post('/unique', this.unique)

    // local login routes - username/password
    this.router.post('/login/local', this.local, this.login)

    // JWT login routes
    this.router.get('/login/token', passport.authenticate('platformJwt', {
      session: false
    }), this.login)

    // sublist route
    this.router.get('/:username/:sublist', passport.authenticate('platformJwt', {
      session: false
    }), this.sublist)

    // update route
    this.router.patch('/:username', passport.authenticate('platformJwt', {
      session: false
    }), this.update)

    // delete route
    this.router.delete('/:username', passport.authenticate('platformJwt', {
      session: false
    }), this.delete)
  }
}

// export
const platformRouter = new PlatformRouter()
platformRouter.routes()
const thisRouter = platformRouter.router

export default thisRouter
