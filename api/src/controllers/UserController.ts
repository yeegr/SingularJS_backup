import { NextFunction, Request, RequestHandler, Response, Router } from 'express'
import { Schema, Model } from 'mongoose'
import * as moment from 'moment-timezone'
import * as randomstring from 'randomstring'
import * as validator from 'validator'

import { CONFIG, CONST, ERRORS, UTIL } from '../../../common'
import { Logger, Err, LANG } from '../modules'

import IUser from '../interfaces/users/IUser'
import IContent from '../interfaces/share/IContent'

import Totp, { ITotp } from '../models/users/TotpModel'
import SMS from '../modules/sms'
import Emailer from '../modules/email'

import Processor from '../modules/process'
import Process, { IProcess } from '../models/workflow/ProcessModel'
import Activity, { IActivity } from '../models/workflow/ActivityModel'

/**
 * List search results
 *
 * @func list
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
export function list(req: Request, res: Response): void {
  let params = UTIL.assembleSearchParams(req, {
      status: CONST.STATUSES.CONSUMER.ACTIVE
    }, 'handle')

  const UserModel: Model<IUser> = UTIL.getModelFromName(req.routeVar.userType)

  UserModel
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
 * Check if unique field is available to user
 *
 * @func unique
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
export function unique (req: Request, res: Response): void {
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

      case 'username':
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

    const UserModel: Model<IUser> = UTIL.getModelFromName(req.routeVar.userType)

    UserModel
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
 * Initializes TOTP 
 *
 * @class ConsumerRouter
 * @func initTotp
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
export function initTotp(req: Request, res: Response, next: NextFunction): void{
  let body = req.body
  
  if (!body.hasOwnProperty('type')) {
    res.status(400).send(ERRORS.USER.TOTP_TYPE_REQUIRED)
  } else if (CONST.TOTP_TYPES_ENUM.indexOf(body.type) < 0) {
    res.status(400).send(ERRORS.USER.TOTP_TYPE_INVALID)
  } else if (body.type === CONST.TOTP_TYPES.EMAIL && !validator.isEmail(body.value)) {
    res.status(400).send(ERRORS.USER.VALID_EMAIL_ADDRESS_REQUIRED)
  } else if (body.type === CONST.TOTP_TYPES.SMS && !validator.isMobilePhone(body.value, CONFIG.DEFAULT_LOCALE)) {
    res.status(400).send(ERRORS.USER.VALID_MOBILE_PHONE_NUMBER_REQUIRED)
  } else {
    let totp: ITotp = new Totp(Object.assign({}, body, {
        action: CONST.USER_ACTIONS.COMMON.LOGIN,
        code: randomstring.generate({
          length: CONFIG.TOTP_CODE_LENGTH,
          charset: CONFIG.TOTP_CODE_CHARSET
        })
      })),
      mobileTemplate = CONFIG.ALIYUN_SMS_TEMPLATE_CODE

    switch (totp.type) {
      case CONST.TOTP_TYPES.EMAIL:
        let email = new Emailer({
          to: totp.value,
          subject: LANG.t('user.login.totp.email.subject'),
          text: LANG.t('user.login.totp.email.text', {
            code: totp.code,
            expiration: moment(totp.expireAt).format(CONFIG.DEFAULT_DATETIME_FORMAT)
          }),
          html: LANG.t('user.login.totp.email.html', {
            code: totp.code,
            expiration: moment(totp.expireAt).tz(CONFIG.DEFAULT_TIMEZONE).format(CONFIG.DEFAULT_DATETIME_FORMAT)
          })
        })

        email
        .send()
        .then(() => {
          return totp.save()
        })
        .then(() => {
          res.status(201).json({ message: ERRORS.SUCCESS })
        })
        .catch((err: Error) => {
          res.status(400).send()
          console.log(err)
        })
      break

      case CONST.TOTP_TYPES.SMS:
        let sms = new SMS({
          'mobile': totp.value,
          'template': mobileTemplate,
          'code': totp.code
        })

        sms
        .send()
        .then(() => {
          return totp.save()
        })
        .then(() => {
          res.status(201).json({ message: ERRORS.SUCCESS })
        })
        .catch((err: Error) => {
          res.status(400).send()
          console.log(err)
        })
      break
    }
  }
}

/**
 * Login user
 *
 * @func login
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
export function login(req: Request, res: Response): void {
  const user: IUser = req.user

  res.status(200).json(UTIL.getSignedUser(user))

  new Logger({
    creator: user._id,
    creatorRef: user.ref,
    action: CONST.USER_ACTIONS.COMMON.LOGIN,
    targetRef: user.ref,
    target: user._id,
    state: req.authInfo,
    ua: req.body.ua || req.ua
  })
}

/**
 * Gets user with populated list of user created content
 *
 * @func sublist
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
export function sublist(req: Request, res: Response): void {
  const [user, ref] = UTIL.getLoginedUser(req),
    UserModel: Model<IUser> = UTIL.getModelFromName(ref),
    path = req.params.sublist,
    model = UTIL.getModelNameFromPath(path),
    opt: any = UTIL.assembleSearchParams(req),
    select: string = UTIL.getSelectFieldsFromPath(path)

  UserModel
  .findById(user)
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
      select
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
 * Gets specific user created content,
 * discarding wether has been approved
 *
 * @func content
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
export function content(req: Request, res: Response): void {
  let [creator, creatorRef] = UTIL.getLoginedUser(req),
    path = req.params.sublist,
    slug = req.params.slug,
    DataModel = UTIL.getModelFromName(UTIL.getModelNameFromPath(path))

  DataModel
  .findOne({
    creator,
    creatorRef,
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
 * Updates user
 *
 * @func update
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
export function update(req: Request, res: Response): void {
  const [creator, creatorRef] = UTIL.getLoginedUser(req)
  
  let log = {
    creator,
    creatorRef,
    action: CONST.USER_ACTIONS.COMMON.UPDATE,
    ua: req.body.ua || req.ua
  }

  const UserModel: Model<IUser> = UTIL.getModelFromName(creatorRef)

  UserModel
  .findByIdAndUpdate(creator, req.body, {new: true})
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
 * Deletes user
 *
 * @func remove
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
export function remove(req: Request, res: Response): void {
  const [creator, creatorRef] = UTIL.getLoginedUser(req)

  let log = {
    creator,
    creatorRef,
    action: CONST.USER_ACTIONS.COMMON.DELETE,
    ua: req.body.ua || req.ua
  }

  const UserModel: Model<IUser> = UTIL.getModelFromName(creatorRef)

  UserModel
  .findByIdAndRemove(creator)
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
 * Submit content by id
 *
 * @func submit
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
export function submit(req: Request, res: Response): void {
  const [creator, creatorRef] = UTIL.getLoginedUser(req),
    roles: string[] = req.user.roles,
    target: Schema.Types.ObjectId = req.body.id,
    targetRef: string = req.body.type,
    DataModel: Model<any> = UTIL.getModelFromName(targetRef)

  let log: any = {
    creator,
    creatorRef,
    target,
    targetRef,
    action: CONST.USER_ACTIONS.CONSUMER.SUBMIT,
    ua: req.body.ua || req.ua
  }

  DataModel
  .findOne({
    creator,
    _id: target
  })
  .then((data: IContent) => {
    if (data) {
      if (data.status === CONST.STATUSES.CONTENT.PENDING || data.status === CONST.STATUSES.CONTENT.APPROVED) {
        res.status(422).json({ message: ERRORS.CONTENT.CONTENT_ALREADY_SUMMITED })
      } else if (validator.isEmpty(data.title)) {
        res.status(422).json({ message: ERRORS.CONTENT.CONTENT_TITLE_REQUIRED })
      } else if (validator.isEmpty(data.slug)) {
        res.status(422).json({ message: ERRORS.CONTENT.CONTENT_SLUG_REQUIRED })
      } else if (validator.isEmpty(data.content)) {
        res.status(422).json({ message: ERRORS.CONTENT.CONTENT_CONTENT_REQUIRED })
      } else {
        // approval ? pending : approved
        switch (targetRef) {
          case CONST.ACTION_TARGETS.POST:
            if (CONFIG.POST_REQUIRES_APPROVAL && roles.indexOf(CONFIG.POST_SELF_PUBLISH_ROLE) < 0) {
              data.status = CONST.STATUSES.CONTENT.PENDING
            } else {
              data.status = CONST.STATUSES.CONTENT.APPROVED
            }
          break

          case CONST.ACTION_TARGETS.EVENT:
            if (CONFIG.PUBLIC_EVENT_REQURIES_APPROVAL && data.isPublic && roles.indexOf(CONFIG.PUBLIC_EVENT_PUBLISH_ROLE) > -1) {
              data.status = CONST.STATUSES.CONTENT.PENDING
            } else {
              data.status = CONST.STATUSES.CONTENT.APPROVED
            }
          break

          default:
            data.status = CONST.STATUSES.CONTENT.APPROVED
          break
        }

        return data.save()
      }
    }

    res.status(404).send({ message: ERRORS.CONTENT.NO_ELIGIBLE_CONTENT_FOUND })
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
        /** 
         * submitting post: check if 
         * 1. platform is configured to require approval
         * 2. user has sufficient right (role) to self-publish
        */
        (targetRef === CONST.ACTION_TARGETS.POST && (CONFIG.POST_REQUIRES_APPROVAL || roles.indexOf(CONFIG.POST_SELF_PUBLISH_ROLE) > -1)) || 
        /** 
         * submitting event: check if
         * 1. platform is configured to require approval on public events
         * 2. event is set as public
        */
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
 * Retract content by id
 *
 * @func retract
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
export function retract(req: Request, res: Response): void {
  const [creator, creatorRef] = UTIL.getLoginedUser(req),
    target: Schema.Types.ObjectId = req.body.id,
    targetRef: string = req.body.type,
    DataModel: any = UTIL.getModelFromName(targetRef)

  let log: any = {
    creator,
    creatorRef,
    target,
    targetRef,
    action: CONST.USER_ACTIONS.CONSUMER.RETRACT,
    ua: req.body.ua || req.ua          
  }

  DataModel
  .findOne({
    creator,
    _id: target
  })
  .then((data: IContent) => {
    if (data) {
      if (data.status === CONST.STATUSES.CONTENT.EDITING) {
        res.status(422).json({ message: ERRORS.CONTENT.CONTENT_CANNOT_BE_RETRACTED })
        return null
      } else {
        data.status = CONST.STATUSES.CONTENT.EDITING
        return data.save()
      }
    }

    res.status(404).send({ message: ERRORS.CONTENT.NO_ELIGIBLE_CONTENT_FOUND })
    return null
  })
  .then((data: IContent) => {
    res.status(200).json(data)
    new Logger(log)

    // retract submission/approval process if required
    if (CONFIG.POST_REQUIRES_APPROVAL) {
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

/**
 * Creates standard routes for entry
 * 
 * @func createRoutes
 * @param {Router} router
 * @param {RequestHandler} auth
 * @return {void}
 */
export function createRoutes(router: Router, auth: RequestHandler, setRouteVar: RequestHandler): void {
  // list route
  router.get('/users', setRouteVar, list)

  // route to check unique values
  router.post('/users/unique', setRouteVar, unique)

  // TOTP login routes
  router.post('/login/totp', setRouteVar, initTotp)

  // verifies TOTP and login
  // router.patch('/login/totp', setRouteVar, verifyTotp)

  // JWT login routes
  router.get('/login/token', auth, login)

  // sublist route
  router.get('/self/:sublist', auth, sublist)

  // user content route
  router.get('/self/:sublist/:slug', auth, content)

  // update route
  router.patch('/self', auth, update)

  // delete route
  router.delete('/self', auth, remove)

  // user submit content route
  router.post('/self/submit', auth, submit)

  // user retract content route
  router.post('/self/retract', auth, retract)
}