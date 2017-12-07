import { NextFunction, Request, Response, Router } from 'express'
import { Schema, Types } from 'mongoose'
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
import Err from '../modules/err'
import Processor from '../modules/process'

import Process from '../models/workflow/ProcessModel'
import IProcess from '../interfaces/workflow/IProcess'
import Activity from '../models/workflow/ActivityModel'
import IActivity from '../interfaces/workflow/IActivity'

import Consumer from '../models/users/ConsumerModel'
import IUser from '../interfaces/users/IUser'

import Totp from '../models/TotpModel'
import ITotp from '../interfaces/ITotp'
import SMS from '../modules/sms'

import IContent from '../interfaces/share/IContent'

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
    .lean()
    .exec()
    .then((arr: IUser[]) => {
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
    .then((user: IUser) => {
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
      .then((data: IUser) => {
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
      res.status(401).json({ message: ERR.USER.MISSING_CREDENTIALS })      
    } else if (!body.hasOwnProperty('password') || !UTIL.validatePassword(body.password)) {
      res.status(401).json({ message: ERR.USER.VALID_PASSWORD_REQUIRED })
    } else {
      let user: IUser = new Consumer({
        handle: body.handle,
        password: body.password
      })

      this.createConsumer(user, req, res)
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
    const _id: string = req.user._id
    
    let log = {
      creator: _id,
      creatorRef: CONST.USER_TYPES.CONSUMER,
      action: CONST.USER_ACTIONS.COMMON.UPDATE,
      ua: req.body.ua || req.ua
    }

    Consumer
    .findByIdAndUpdate(_id, req.body, {new: true})
    .then((user: IUser) => {
      if (user) {
        res.status(200).json(UTIL.getSignedUser(user))
        new Logger(log)
      }

      res.status(404).send()
    })
    .catch((err: Error) => {
      new Err(res, err, log)
    })
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
    const _id: string = req.user._id
    
    let log = {
      creator: _id,
      creatorRef: CONST.USER_TYPES.CONSUMER,
      action: CONST.USER_ACTIONS.COMMON.DELETE,
      ua: req.body.ua || req.ua
    }

    Consumer
    .findByIdAndRemove(_id)
    .then((user: IUser) => {
      if (user) {
        res.status(204).end()
        new Logger(log)        
      }

      res.status(404).send()
    })
    .catch((err: Error) => {
      new Err(res, err, log)
    })
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
    const user: IUser = req.user

    res.status(200).json(UTIL.getSignedUser(user))

    new Logger({
      creator: user._id,
      creatorRef: CONST.USER_TYPES.CONSUMER,
      action: CONST.USER_ACTIONS.COMMON.LOGIN,
      state: req.authInfo,
      ua: req.body.ua || req.ua
    })
  }

  /**
   * Creates a single user
   * 
   * @param {IUser} user 
   * @param {Request} req 
   * @param {Response} res 
   */
  private createConsumer(user: IUser, req: Request, res: Response): void {
    let log = {
      creatorRef: CONST.USER_TYPES.CONSUMER,
      action: CONST.USER_ACTIONS.COMMON.CREATE,
      ua: req.body.ua || req.ua
    }

    user
    .save()
    .then((data: IUser) => {
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
      badRequestMessage: ERR.USER.MISSING_CREDENTIALS
    }, (err: Error, user: IUser, info: object) => {
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
    query.expireAt = {}
    query.expireAt.$gte = now
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
      .then((user: IUser) => {
        if (user) {
          res.status(200).json(UTIL.getSignedUser(user))
        } else {
          let user: IUser = new Consumer(query)
          this.createConsumer(user, req, res)
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
    let id: string = req.user._id,
      path = req.params.sublist,
      model = UTIL.getModelNameFromPath(path),
      opt: any = UTIL.assembleSearchParams(req)

    Consumer
    .findById(id)
    .select('handle')
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
    .lean()
    .exec()
    .then((data: IUser) => {
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

  /**
   * Gets user with populated sublist
   *
   * @class ConsumerRouter
   * @method content
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public content = (req: Request, res: Response): void => {
    let creator: string = req.user._id,
      path = req.params.sublist,
      slug = req.params.slug,
      Model = UTIL.getModelFromKey(UTIL.getModelNameFromPath(path))

    Model
    .findOne({
      creator,
      slug
    })
    .exec()
    .then((data: any) => {
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

  /**
   * Submit content by id
   *
   * @class ConsumerRouter
   * @method submit
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public submit = (req: Request, res: Response): void => {
    const user: IUser = req.user,
      creator: Schema.Types.ObjectId = user._id,
      _id: Schema.Types.ObjectId = req.body.id,
      targetRef: string = req.body.type,
      Model: any = UTIL.getModelFromKey(targetRef)

    let log: any = {
      creator,
      creatorRef: user.ref,
      target: _id,
      targetRef,
      action: CONST.USER_ACTIONS.CONSUMER.SUBMIT,
      ua: req.body.ua || req.ua
    }

    Model
    .findOne({creator, _id})
    .then((data: IContent) => {
      if (data) {
        if (data.status === CONST.STATUSES.CONTENT.PENDING || data.status === CONST.STATUSES.CONTENT.APPROVED) {
          res.status(422).json({ message: ERR.CONTENT.CONTENT_ALREADY_SUMMITED })
        } else if (validator.isEmpty(data.slug)) {
          res.status(422).json({ message: ERR.CONTENT.CONTENT_TITLE_REQUIRED })
        } else if (validator.isEmpty(data.slug)) {
          res.status(422).json({ message: ERR.CONTENT.CONTENT_SLUG_REQUIRED })
        } else if (validator.isEmpty(data.content)) {
          res.status(422).json({ message: ERR.CONTENT.CONTENT_CONTENT_REQUIRED })
        } else {
          // approval ? pending : approved
          switch (targetRef) {
            case CONST.ACTION_TARGETS.POST:
              data.status = CONFIG.POST_REQURIES_APPROVAL ? CONST.STATUSES.CONTENT.PENDING : CONST.STATUSES.CONTENT.APPROVED
            break

            case CONST.ACTION_TARGETS.EVENT:
              data.status = (data.isPublic && CONFIG.PUBLIC_EVENT_REQURIES_APPROVAL) ? CONST.STATUSES.CONTENT.PENDING : CONST.STATUSES.CONTENT.APPROVED
            break

            default:
              data.status = CONST.STATUSES.CONTENT.APPROVED
            break
          }

          return data.save()
        }
      }

      res.status(404).send({ message: ERR.CONTENT.NO_ELIGIBLE_CONTENT_FOUND })
      return null
    })
    .then((data: IContent) => {
      if (data) {
        res.status(200).json(data)
        new Logger(log)
  
        let init: IActivity = new Activity({
          creator: log.creator,
          creatorRef: log.creatorRef,
          target: log.target,
          targetRef: log.targetRef,
          action: log.action,
          initStatus: data.status
        })

        // create submission/approval process if required
        if (
          // submitting post (always public)
          (targetRef === CONST.ACTION_TARGETS.POST && CONFIG.POST_REQURIES_APPROVAL) || 
          // submitting public event
          (targetRef === CONST.ACTION_TARGETS.EVENT && CONFIG.PUBLIC_EVENT_REQURIES_APPROVAL && data.isPublic)
        ) {
          new Processor(init, CONST.PROCESS_TYPES.APPROVAL)
        }
      }
    })
    .catch((err: Error) => {
      new Err(res, err, log)
    })
  }
  
  /**
   * Retract entry by params of 'slug'
   *
   * @class PostRouter
   * @method retract
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public retract = (req: Request, res: Response): void => {
    const user: IUser = req.user,
      creator: Schema.Types.ObjectId = user._id,
      _id: Schema.Types.ObjectId = req.body.id,
      targetRef: string = req.body.type,
      Model: any = UTIL.getModelFromKey(targetRef)

    let log: any = {
      creator,
      creatorRef: user.ref,
      target: _id,
      targetRef,
      action: CONST.USER_ACTIONS.CONSUMER.RETRACT,
      ua: req.body.ua || req.ua          
    }

    Model
    .findOne({creator, _id})
    .then((data: IContent) => {
      if (data) {
        if (data.status === CONST.STATUSES.CONTENT.EDITING) {
          res.status(422).json({ message: ERR.CONTENT.CONTENT_CANNOT_BE_RETRACTED })
          return null
        } else {
          data.status = CONST.STATUSES.CONTENT.EDITING
          return data.save()
        }
      }

      res.status(404).send({ message: ERR.CONTENT.NO_ELIGIBLE_CONTENT_FOUND })
      return null
    })
    .then((data: IContent) => {
      res.status(200).json(data)
      new Logger(log)

      // retract submission/approval process if required
      if (CONFIG.POST_REQURIES_APPROVAL) {
        return Process
        .findOneAndUpdate({
          creator: log.creator,
          creatorRef: log.creatorRef,
          target: log.target,
          targetRef: log.targetRef,
          type: CONST.PROCESS_TYPES.APPROVAL
        }, {
          status: CONST.STATUSES.PROCESS.CANCELLED,
          completed: UTIL.getTimestamp()
        })
        .sort({_id: -1})
      } else {
        return null
      }
    })
    .catch((err: Error) => {
      new Err(res, err, log)
    })
  }

  routes() {
    // list route
    this.router.get('/users', this.list)
    this.router.get('/users/:handle', this.get)
    
    // create route
    this.router.post('/users', this.create)
    
    // route to check unique values
    this.router.post('/users/unique', this.unique)

    // login routes
    // local login routes - user handle/password
    this.router.post('/login/local', this.local, this.login)

    // TOTP login routes
    this.router.post('/login/totp', this.initTotp)
    this.router.patch('/login/totp', this.verifyTotp)

    // JWT login route
    this.router.get('/mine', passport.authenticate('consumerJwt', {
      session: false
    }), this.login)

    // update route
    this.router.patch('/mine', passport.authenticate('consumerJwt', {
      session: false
    }), this.update)

    // delete route
    this.router.delete('/mine', passport.authenticate('consumerJwt', {
      session: false
    }), this.delete)

    // sublist route
    this.router.get('/mine/:sublist', passport.authenticate('consumerJwt', {
      session: false
    }), this.sublist)

    // user content route
    this.router.get('/mine/:sublist/:slug', passport.authenticate('consumerJwt', {
      session: false
    }), this.content)

    // user submit content route
    this.router.post('/mine/submit', passport.authenticate('consumerJwt', {
      session: false
    }), this.submit)

    // user retract content route
    this.router.post('/mine/retract', passport.authenticate('consumerJwt', {
      session: false
    }), this.retract)
  }
}

// export
const consumerRouter = new ConsumerRouter()
consumerRouter.routes()
const thisRouter = consumerRouter.router

export default thisRouter
