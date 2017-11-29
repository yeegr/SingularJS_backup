import { NextFunction, Request, Response, Router } from 'express'
import * as moment from 'moment'
import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'
import '../config/passport/consumer'
import * as validator from 'validator'
import * as randomstring from 'randomstring'

import * as CONFIG from '../../../common/options/config'
import * as CONST from '../../../common/options/constants'
import * as ERR from '../../../common/options/errors'
import * as UTIL from '../../../common/util'
import Logger from '../modules/logger'

import Consumer from '../models/users/ConsumerModel'
import IConsumer from '../interfaces/users/IConsumer'

import Totp from '../models/TotpModel'
import ITotp from '../interfaces/ITotp'

import SMS from '../modules/sms'

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
   * List search results
   *
   * @class ConsumerRouter
   * @method list
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public list = (req: Request, res: Response): void => {
    let params = UTIL.assembleSearchParams(req, {
        status: CONST.STATUSES.CONSUMER.ACTIVE
      }, 'handle')

    Consumer
    .find(params.query)
    .skip(params.skip)
    .limit(params.limit)
    .sort(params.sort)
    .select(CONST.PUBLIC_CONSUMER_INFO_LIST)
    .exec()
    .then((arr: IConsumer[]) => {
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
          'status': CONST.STATUSES.POST.APPROVED,
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
          'status': CONST.STATUSES.EVENT.APPROVED,
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
    .then((user: IConsumer) => {
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).send()
      }
    })
    .catch((err: Error) => {
      UTIL.formatError(res, err, CONST.USER_ACTIONS.COMMON.GET, CONST.ACTION_TARGETS.CONSUMER)
    })
  }
  
  /**
   * Check if unique field is available to user
   *
   * @class ConsumerRouter
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
        case 'handle':
        default:
          // validate user handle
          if (UTIL.validateHandle(value)) {
            query = {handle: value}
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

      Consumer
      .findOne(query)
      .then((data: IConsumer) => {
        let isAvailable: boolean = !(data)
        res.status(200).json({isAvailable})
      })
      .catch((err: Error) => {
        UTIL.formatError(res, err, CONST.USER_ACTIONS.COMMON.UNIQUE, CONST.ACTION_TARGETS.CONSUMER)
      })
    }
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
    let body: any = req.body,
      device: any = req.body.device

    if (!body.hasOwnProperty('handle') || !UTIL.validateHandle(body.handle)) {
      res.status(401).json({ message: ERR.USER.MISSING_CREDENTIALS })      
    } else if (!body.hasOwnProperty('password') || !UTIL.validatePassword(body.password)) {
      res.status(401).json({ message: ERR.USER.VALID_PASSWORD_REQUIRED })
    } else {
      let user: IConsumer = new Consumer({
        handle: body.handle,
        password: body.password
      })

      this.createConsumer(user, device, res)
    }
  }
  
  /**
   * Updates entry by params of 'handle'
   *
   * @class ConsumerRouter
   * @method update
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public update = (req: Request, res: Response): void => {
    const handle: string = req.params.handle,
      _id: string = req.user._id,
      device: any = req.body.device
    
    if (handle === req.user.handle) {
      Consumer
      .findByIdAndUpdate(_id, req.body, {new: true})
      .then((user: IConsumer) => {
        if (user) {
          res.status(200).json(UTIL.getSignedUser(user))
  
          new Logger({
            creator: user._id,
            ref: CONST.USER_TYPES.CONSUMER,
            action: CONST.USER_ACTIONS.COMMON.UPDATE,
            type: CONST.ACTION_TARGETS.CONSUMER,
            target: user._id,
            device
          })
        } else {
          res.status(404).send()
        }
      })
      .catch((err: Error) => {
        UTIL.formatError(res, err, CONST.USER_ACTIONS.COMMON.UPDATE, CONST.ACTION_TARGETS.CONSUMER)
      })
    } else {
      res.status(401).json({ message: ERR.USER.PERMISSION_DENIED })
    }
  }
  
  /**
   * Deletes entry by params of 'handle'
   *
   * @class ConsumerRouter
   * @method delete
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public delete = (req: Request, res: Response): void => {
    const handle: string = req.params.handle,
      _id: string = req.user._id,
      device: any = req.body.device
    
    if (handle === req.user.handle) {
      Consumer
      .findByIdAndRemove(_id)
      .then((user: IConsumer) => {
        if (user) {
          res.status(204).end()
          
          new Logger({
            creator: _id,
            ref: CONST.USER_TYPES.CONSUMER,
            action: CONST.USER_ACTIONS.COMMON.DELETE,
            type: CONST.ACTION_TARGETS.CONSUMER,
            target: user._id,
            device
          })        
        } else {
          res.status(404).send()
        }
      })
      .catch((err: Error) => {
        UTIL.formatError(res, err, CONST.USER_ACTIONS.COMMON.DELETE, CONST.ACTION_TARGETS.CONSUMER)
      })
    } else {
      res.status(401).json({ message: ERR.USER.PERMISSION_DENIED })
    }
  }

  /**
   * Login user
   *
   * @class ConsumerRouter
   * @method login
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public login = (req: Request, res: Response): void => {
    const user: IConsumer = req.user

    res.status(200).json(UTIL.getSignedUser(user))

    new Logger({
      creator: user._id,
      ref: CONST.USER_TYPES.CONSUMER,
      action: CONST.USER_ACTIONS.COMMON.LOGIN,
      type: CONST.ACTION_TARGETS.CONSUMER,
      target: user._id,
      misc: req.authInfo,
      device: req.body.device
    })
  }

  /**
   * Creates a single user
   * 
   * @param {IConsumer} user 
   * @param {any} device 
   * @param {Response} res 
   */
  private createConsumer(user: IConsumer, device: any, res: Response): void {
    user
    .save()
    .then((user: IConsumer) => {
      res.status(201).json(UTIL.getSignedUser(user))

      new Logger({
        creator: user._id,
        ref: CONST.USER_TYPES.CONSUMER,
        action: CONST.USER_ACTIONS.COMMON.CREATE,
        type: CONST.ACTION_TARGETS.CONSUMER,
        target: user._id,
        device
      })        
    })
    .catch((err: Error) => {
      UTIL.formatError(res, err, CONST.USER_ACTIONS.COMMON.CREATE, CONST.ACTION_TARGETS.CONSUMER)
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
      badRequestMessage: ERR.USER.MISSING_CREDENTIALS
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
   * Initializes TOTP 
   *
   * @class ConsumerRouter
   * @method initTotp
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {void}
   */
  public initTotp = (req: Request, res: Response, next: NextFunction): void => {
    let totp: ITotp = new Totp((<any>Object).assign({
      action: CONST.USER_ACTIONS.COMMON.LOGIN,
      code: randomstring.generate({
        length: CONFIG.TOTP_CODE_LENGTH,
        charset: CONFIG.TOTP_CODE_CHARSET
      })
    }, req.body))

    totp
    .save()
    .then((data) => {
      let sms = new SMS({'content':'something'})
      // sms.send({'content':'something'})

      res.status(201).send('Success')
    })
    .catch((err: Error) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
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
    let query: any = (<any>Object).assign({}, req.body),
      now: number = moment().valueOf()
    query.expiredAt = {}
    query.expiredAt.$gte = now
    query.verifiedAt = null

    Totp
    .findOneAndUpdate(query, {
      verifiedAt: now
    })
    .then((totp: ITotp) => {
      let query: any = {}

      switch (totp.type) {
        case 'mobile':
          query.mobile = totp.value
        break
      }

      Consumer
      .findOne(query)
      .then((user: IConsumer) => {
        if (user) {
          res.status(200).json(UTIL.getSignedUser(user))
        } else {
          let user: IConsumer = new Consumer(query)
          this.createConsumer(user, req.body.device, res)
        }
      })
    })
    .catch((err: Error) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
  }

  /**
   * Gets user with populated sublist
   *
   * @class ConsumerRouter
   * @method sublist
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public sublist = (req: Request, res: Response): void => {
    let handle = req.params.handle,
      id: string = req.user._id,
      path = req.params.sublist,
      model = UTIL.getModelFromPath(path),
      opt: any = UTIL.assembleSearchParams(req)

    if (handle === req.user.handle) {
      Consumer
      .findOne({handle})
      .select('_id handle')
      .populate({
        path,
        model,
        options: {
          sort: opt.sort,
          limit: opt.limit,
          skip: opt.skip
        },
        populate: ({
          path: 'target',
          select: 'slug title excerpt commentCount totalRatings averageRating'
        })
      })
      .exec()
      .then((data: IConsumer) => {
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
    } else {
      res.status(422).json({ message: ERR.USER.PERMISSION_DENIED })
    }
  }

  routes() {
    // list route
    this.router.get('/', this.list)
    this.router.get('/:handle', this.get)
    
    // create route
    this.router.post('/', this.create)
    
    // route to check unique values
    this.router.post('/unique', this.unique)

    // login routes
    // local login routes - user handle/password
    this.router.post('/login/local', this.local, this.login)

    // TOTP login routes
    this.router.post('/login/totp', this.initTotp)
    this.router.patch('/login/totp', this.verifyTotp)

    // JWT login routes
    this.router.get('/login/token', passport.authenticate('consumerJwt', {
      session: false
    }), this.login)

    // sublist route
    this.router.get('/:handle/:sublist', passport.authenticate('consumerJwt', {
      session: false
    }), this.sublist)

    // update route
    this.router.patch('/:handle', passport.authenticate('consumerJwt', {
      session: false
    }), this.update)

    // delete route
    this.router.delete('/:handle', passport.authenticate('consumerJwt', {
      session: false
    }), this.delete)
  }
}

// export
const consumerRouter = new ConsumerRouter()
consumerRouter.routes()
const thisRouter = consumerRouter.router

export default thisRouter
