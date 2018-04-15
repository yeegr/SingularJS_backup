import { NextFunction, Request, RequestHandler, Response, Router } from 'express'
import { Schema, Model } from 'mongoose'
import * as fs from 'fs'
import * as moment from 'moment-timezone'
import * as randomstring from 'randomstring'
import * as validator from 'validator'
import * as passport from 'passport'
import * as path from 'path'
import * as request from 'request'
import * as util from 'util'
import '../config/passport/consumer'
import '../config/passport/platform'
import { IncomingForm, Fields, Files } from 'formidable'

import { CONFIG, CONST, ERRORS, SERVERS } from '../../../common'
import { Logger, Err, LANG, UTIL } from '../modules'

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
  .then((data: IUser[]) => {
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
 * Reads a key/value pair, validates the value 
 * and returns a normalized kvp
 * 
 * @param {any} body
 * @returns {[boolean, any]} 
 */
export function validateQuery(body: any): [boolean, any] {
  let result = false,
    query = null,
    tuple: any = UTIL.kvp2tuple(body),
    key: string = tuple[0],
    value: string = tuple[1].toString().trim()

  if (['username', 'handle', 'email', 'mobile'].indexOf(key) < 0) {
    return [result, { code: ERRORS.LOGIN.UNKNOWN_QUERY }]
  } else {
    switch (key) {
      // validate user username
      case 'username':
        if (UTIL.validateUsername(value)) {
          result = true
          query = {username: value}
        } else {
          query = { code: ERRORS.LOGIN.VALID_USER_NAME_REQUIRED }
        }
      break

      // validate user handle
      case 'handle':
        if (UTIL.validateHandle(value)) {
          result = true
          query = {handle: value}
        } else {
          query = { code: ERRORS.LOGIN.VALID_USER_HANDLE_REQUIRED }
        }
      break

      // validate email address
      case 'email':
        if (validator.isEmail(value)) {
          result = true
          query = {email: value}
        } else {
          query = { code: ERRORS.LOGIN.VALID_EMAIL_ADDRESS_REQUIRED }
        }
      break

      // validate mobile phone number
      case 'mobile':
        value = UTIL.normalizeMobile(value)

        if (validator.isMobilePhone(value, CONFIG.DEFAULT_LOCALE)) {
          result = true
          query = {mobile: value}
        } else {
          query = { code: ERRORS.LOGIN.VALID_MOBILE_PHONE_NUMBER_REQUIRED }
        }
      break
    }

    return [result, query]
  }
}

/**
 * Check if unique field is available to user
 *
 * @func isUnique
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
export function isUnique(req: Request, res: Response): void {
  let [result, query] = validateQuery(req.body)

  if (!result) {
    res.status(400).send(query)
  } else {
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
 * @export
 * @func initTotp
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
export function initTotp(req: Request, res: Response, next: NextFunction): void {
  let body = req.body,
    UserModel: Model<IUser> = UTIL.getModelFromName(req.routeVar.userType)
  
  if (!body.hasOwnProperty('action')) {
    res.status(400).send({
      code: ERRORS.LOGIN.TOTP_ACTION_REQUIRED
    })
  } else if (!body.hasOwnProperty('type')) {
    res.status(400).send({
      code: ERRORS.LOGIN.TOTP_TYPE_REQUIRED
    })
  } else if (CONST.TOTP_TYPES_ENUM.indexOf(body.type) < 0) {
    res.status(400).send({
      code: ERRORS.LOGIN.TOTP_TYPE_INVALID
    })
  } else if (body.type === CONST.TOTP_TYPES.EMAIL && !validator.isEmail(body.value)) {
    res.status(400).send({
      code: ERRORS.LOGIN.VALID_EMAIL_ADDRESS_REQUIRED
    })
  } else if (body.type === CONST.TOTP_TYPES.SMS && !validator.isMobilePhone(body.value, CONFIG.DEFAULT_LOCALE)) {
    res.status(400).send({
      code: ERRORS.LOGIN.VALID_MOBILE_PHONE_NUMBER_REQUIRED
    })
  } else if (body.action === CONST.USER_ACTIONS.COMMON.UPDATE) {
    let query: any = {}
    query[body.type] = body.value

    UserModel
    .findOne(query)
    .then((data: IUser) => {
      if (!data) {
        return next()
      }

      res.status(200).json({isAvailable: false})
    })
    .catch((err: Error) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
  } else if (body.action === CONST.USER_ACTIONS.COMMON.RESET_PASSWORD) {
    let query: any = {}
    query[body.type] = body.value

    UserModel
    .findOne(query)
    .then((data: IUser) => {
      if (!data) {
        res.status(404).json({ code: ERRORS.LOGIN.USER_NOT_FOUND })
        return false
      }

      next()
    })
    .catch((err: Error) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
  } else {
    next()
  }
}

/**
 * Sends a time-based one-time passcode (TOTP)
 * 
 * @export
 * @func sendTotp
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {void}
 */
export function sendTotp(req: Request, res: Response, next: NextFunction): void {
  const body = req.body,
    totp: ITotp = new Totp(Object.assign({}, body, {
      code: randomstring.generate({
        length: CONFIG.TOTP_CODE_LENGTH,
        charset: CONFIG.TOTP_CODE_CHARSET
      })
    })),
    templateList = (CONFIG.SMS_PROVIDER === 'ALIYUN') ? CONFIG.ALIYUN_SMS_TEMPLATES : null

  let subject = '',
    text = '',
    html = '',
    smsTemplate = ''

  switch (totp.type) {
    case CONST.TOTP_TYPES.EMAIL:
      switch (totp.action) {
        case CONST.USER_ACTIONS.COMMON.LOGIN:
          subject = LANG.t('user.login.totp.email.subject')
          text = LANG.t('user.login.totp.email.text', {
            code: totp.code,
            expiration: moment(totp.expireAt).format(CONFIG.DEFAULT_DATETIME_FORMAT)
          })
          html = LANG.t('user.login.totp.email.html', {
            code: totp.code,
            expiration: moment(totp.expireAt).tz(CONFIG.DEFAULT_TIMEZONE).format(CONFIG.DEFAULT_DATETIME_FORMAT)
          })
        break

        case CONST.USER_ACTIONS.COMMON.RESET_PASSWORD:
          subject = LANG.t('user.reset_password.totp.email.subject')
          text = LANG.t('user.reset_password.totp.email.text', {
            code: totp.code,
            expiration: moment(totp.expireAt).format(CONFIG.DEFAULT_DATETIME_FORMAT)
          })
          html = LANG.t('user.reset_password.totp.email.html', {
            code: totp.code,
            expiration: moment(totp.expireAt).tz(CONFIG.DEFAULT_TIMEZONE).format(CONFIG.DEFAULT_DATETIME_FORMAT)
          })
        break

        case CONST.USER_ACTIONS.COMMON.UPDATE:
          subject = LANG.t('user.update.totp.email.subject')
          text = LANG.t('user.update.totp.email.text', {
            code: totp.code,
            expiration: moment(totp.expireAt).format(CONFIG.DEFAULT_DATETIME_FORMAT)
          })
          html = LANG.t('user.update.totp.email.html', {
            code: totp.code,
            expiration: moment(totp.expireAt).tz(CONFIG.DEFAULT_TIMEZONE).format(CONFIG.DEFAULT_DATETIME_FORMAT)
          })
        break
      }

      let email = new Emailer({
        to: totp.value,
        subject,
        text,
        html
      })

      email
      .send()
      .then(() => {
        return totp.save()
      })
      .then(() => {
        res.status(201).json({ code: ERRORS.SUCCESS })
      })
      .catch((err: Error) => {
        res.status(400).send()
        console.log(err)
      })
    break

    case CONST.TOTP_TYPES.SMS:
      switch (totp.action) {
        case CONST.USER_ACTIONS.COMMON.LOGIN:
          smsTemplate = templateList.LOGIN_SIGNUP
        break

        case CONST.USER_ACTIONS.COMMON.RESET_PASSWORD:
          smsTemplate = templateList.RESET_PASSWORD
        break

        case CONST.USER_ACTIONS.COMMON.UPDATE:
          smsTemplate = templateList.UPDATE_MOBILE_NUMBER
        break
      }

      let sms = new SMS({
        'mobile': totp.value,
        'template': smsTemplate,
        'code': totp.code
      })

      sms
      .send()
      .then(() => {
        return totp.save()
      })
      .then(() => {
        res.status(201).json({ code: ERRORS.SUCCESS })
      })
      .catch((err: Error) => {
        res.status(400).send()
        console.log(err)
      })
    break
  }
}

/**
 * Verifies passwords inputs
 * 
 * @export
 * @func verifyPasswords
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {void}
 */
export function verifyPasswords(req: Request, res: Response, next: NextFunction): void {
  if (req.body.action === CONST.USER_ACTIONS.COMMON.RESET_PASSWORD) {
    let password1 = req.body.password1,
      password2 = req.body.password2

    if (password1 && password2) {
      if (password1 !== password2) {
        res.status(406).json({ code: ERRORS.LOGIN.PASSWORDS_DO_NOT_MATCH })
      } else if (!UTIL.validatePassword(password1)) {
        res.status(406).json({ code: ERRORS.LOGIN.VALID_PASSWORD_REQUIRED })
      } else {
        next()
      }
    } else {
      // need to edit /node_modules/passport-local/lib/strategy.js
      res.status(406).json({ code: ERRORS.LOGIN.MISSING_CREDENTIALS })
    }
  } else {
    next()
  }
}

/**
 * Assembles user query using TOTP info
 * 
 * @export
 * @func assembleQuery
 * @param {ITotp} totp 
 * @returns {*} 
 */
export function assembleQuery(totp: ITotp): any {
  let query: any = {}
        
  switch (totp.type) {
    case CONST.TOTP_TYPES.SMS:
      query.mobile = totp.value
    break

    case CONST.TOTP_TYPES.EMAIL:
      query.email = totp.value
    break
  }

  return query
}

/**
 * Verifies time-based one-time passcode (TOTP),
 * and process request by TOTP action and type
 *
 * @export
 * @func verifyTotp
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
export function verifyTotp(req: Request, res: Response, next: NextFunction): void {
  let log: any = {
      creatorRef: req.routeVar.userType,
      action: req.body.action,
      ua: req.body.ua || req.ua
    },
    query: any = {
      action: req.body.action,
      type: req.body.type,
      value: req.body.value,
      code: req.body.code,
      verifiedAt: null
    }

  const UserModel: Model<IUser> = UTIL.getModelFromName(req.routeVar.userType),
    now: number = moment().valueOf()

  Totp
  .findOne(query)
  .then((totp: ITotp) => {
    if (!totp) {
      res.status(400).json({ code: ERRORS.LOGIN.NO_VALID_TOTP_ISSUED })
      return null    
    }

    if (totp.expireAt <= now) {
      res.status(400).json({ code: ERRORS.LOGIN.TOTP_CODE_EXPIRED })
      return null
    }

    totp.verifiedAt = now
    return totp.save()
  })
  .then((totp: ITotp) => {
    if (totp) {
      let q: any = assembleQuery(totp)

      if (totp.action === CONST.USER_ACTIONS.COMMON.UPDATE) {
        q.updated = now

        return UserModel
          .findByIdAndUpdate(req.user._id, q, {new: true})
      } else {
        return UserModel
        .findOne(q)
        .then((user: IUser) => {
          if (totp.action === CONST.USER_ACTIONS.COMMON.LOGIN) {
            if (user) {
              req.user = user
              req.authInfo = totp.type
              next()
            } else if (req.routeVar.userType === CONST.USER_TYPES.CONSUMER) {
              // creates a new user if matching credentials not found
              let user: IUser = new UserModel(q)
              createUser(user, req, res)
            }
            return null
          } else if (totp.action === CONST.USER_ACTIONS.COMMON.RESET_PASSWORD) {
            // update user password
            // due to bcrypt document middleware, cannot use update() methods, must use save()
            user.password = req.body.password1
            return user.save()
          }
        })            
      }
    }
  })
  .then((user: IUser) => {
    if (user) {
      res.status(200).json(UTIL.getSignedUser(user))

      log.creator = user._id
      log.creatorRef = user.ref
      new Logger(log)
    }
  })
  .catch((err: Error) => {
    new Err(res, err, log)
  })
}
 
/**
 * Creates a single user with handle/password
 *
 * @export
 * @func create
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
export function create(req: Request, res: Response, next: NextFunction): void {
  let body: any = req.body

  const UserModel: Model<IUser> = UTIL.getModelFromName(req.routeVar.userType)

  if (!body.hasOwnProperty('username') || !UTIL.validateUsername(body.username)) {
    res.status(401).json({ code: ERRORS.LOGIN.MISSING_CREDENTIALS })      
  } else if (!body.hasOwnProperty('password') || !UTIL.validatePassword(body.password)) {
    res.status(401).json({ code: ERRORS.LOGIN.VALID_PASSWORD_REQUIRED })
  } else {
    let user: IUser = new UserModel({
      username: body.username,
      password: body.password
    })

    createUser(user, req, res)
  }
}

/**
 * Creates a single user
 * 
 * @export
 * @func createUser
 * @param {IUser} user 
 * @param {Request} req 
 * @param {Response} res 
 * @returns {void}
 */
export function createUser(user: IUser, req: Request, res: Response): void {
  let log = {
    creatorRef: user.ref,
    action: CONST.USER_ACTIONS.COMMON.CREATE,
    ua: req.body.ua || req.ua
  }

  user
  .save()
  .then((data: IUser) => {
    req.user = data
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
 * @export
 * @func local
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
export function local(req: Request, res: Response, next: NextFunction): void {
  let strategy: string

  switch (req.routeVar.userType) {
    case CONST.USER_TYPES.CONSUMER:
      strategy = 'consumerLocal'
    break

    case CONST.USER_TYPES.SUPPLIER:
      strategy = 'supplierLocal'
    break

    case CONST.USER_TYPES.PLATFORM:
      strategy = 'platformLocal'
    break
  }

  passport.authenticate(strategy, {
    session: false,
    failureFlash: ERRORS.LOGIN.MISSING_CREDENTIALS
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
 * Login user
 *
 * @export
 * @func login
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
export function login(req: Request, res: Response): void {
  const user: IUser = req.user as IUser

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
 * @export
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
 * @export
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
 * @export
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
    },
    update = UTIL.sanitizeObject(req.body,
      CONST.USER_UNUPDATABLE_FIELDS,
      true
    )
  
  const UserModel: Model<IUser> = UTIL.getModelFromName(creatorRef)

  UserModel
  .findByIdAndUpdate(creator, update, {new: true})
  .then((user: IUser) => {
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

/**
 * Updates user
 *
 * @export
 * @func update
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
export function avatar(req: Request, res: Response): void {
  const [creator, creatorRef] = UTIL.getLoginedUser(req),
    UserModel: Model<IUser> = UTIL.getModelFromName(creatorRef),
    root: string = UTIL.getRootFolderFromModelName(creatorRef),
    now: string = UTIL.getTimestamp().toString()
  
  let form: IncomingForm = new IncomingForm(),
    filePath = path.join(root, creator.toString(), now),
    log = {
      creator,
      creatorRef,
      action: CONST.USER_ACTIONS.COMMON.UPDATE,
      ua: req.body.ua || req.ua
    }

  form.multiples = false

  form
  .on('file', (fields: Fields, file: any) => {
    let formData = {
      type: CONST.IMAGE_TYPES.AVATAR,
      path: filePath,
      file: {
        value: fs.createReadStream(file.path),
        options: {
          filename: UTIL.renameFile(file.name)
        }
      }
    }

    request.post({
      url: SERVERS.UPLOAD_SERVER,
      formData
    }, (err: Error, response, body) => {
      if (err) console.log(err)

      let fileName = JSON.parse(body).files[0],
        filePath = path.join(now, fileName)

      UserModel
      .findByIdAndUpdate(creator, {avatar: filePath}, {new: true})
      .then((user: IUser) => {
        if (user) {
          res.status(200).json(UTIL.getSignedUser(user))
          new Logger(log)
        }
      })
      .catch((err: Error) => {
        new Err(res, err, log)
      })
    })
  })
  .on('error', (err: Error) => {
    res.status(500).json({err})
  })

  form.parse(req)
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
 * @returns {void}
 */
export function submit(req: Request, res: Response): void {
  const [creator, creatorRef] = UTIL.getLoginedUser(req),
    roles: string[] = req.user.roles,
    target: Schema.Types.ObjectId = req.body.id,
    targetRef: string = req.body.type,
    DataModel: Model<IContent> = UTIL.getModelFromName(targetRef)

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
        res.status(422).json({ code: ERRORS.CONTENT.CONTENT_ALREADY_SUMMITED })
      } else if (validator.isEmpty(data.title)) {
        res.status(422).json({ code: ERRORS.CONTENT.CONTENT_TITLE_REQUIRED })
      } else if (validator.isEmpty(data.slug)) {
        res.status(422).json({ code: ERRORS.CONTENT.CONTENT_SLUG_REQUIRED })
      } else if (validator.isEmpty(data.content)) {
        res.status(422).json({ code: ERRORS.CONTENT.CONTENT_CONTENT_REQUIRED })
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

    res.status(404).send({ code: ERRORS.CONTENT.NO_ELIGIBLE_CONTENT_FOUND })
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
 * @returns {void}
 */
export function retract(req: Request, res: Response): void {
  const [creator, creatorRef] = UTIL.getLoginedUser(req),
    target: Schema.Types.ObjectId = req.body.id,
    targetRef: string = req.body.type,
    DataModel: Model<IContent> = UTIL.getModelFromName(targetRef)

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
        res.status(422).json({ code: ERRORS.CONTENT.CONTENT_CANNOT_BE_RETRACTED })
        return null
      } else {
        data.status = CONST.STATUSES.CONTENT.EDITING
        return data.save()
      }
    }

    res.status(404).send({ code: ERRORS.CONTENT.NO_ELIGIBLE_CONTENT_FOUND })
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
 * @returns {void}
 */
export function createRoutes(router: Router, setRouteVar: RequestHandler, auth: RequestHandler): void {
  // list route
  router.get('/users', setRouteVar, list)

  // route to check unique values
  router.post('/users/unique', setRouteVar, isUnique)

  // create route
  router.post('/users', setRouteVar, create)

  // TOTP login route - create
  router.post('/login/totp', setRouteVar, initTotp, sendTotp)

  // TOTP login route - login/signup
  router.patch('/login/totp', setRouteVar, verifyTotp, login)

  // reset password routes via TOTP
  router.patch('/login/reset', setRouteVar, verifyPasswords, verifyTotp)

  // update routes via TOTP
  router.patch('/self/totp', setRouteVar, auth, verifyTotp)

  // login routes via username/passport
  router.post('/login/local', setRouteVar, local, login)

  // JWT login routes
  router.get('/self', auth, login)

  // sublist route
  router.get('/self/:sublist', auth, sublist)

  // user created content route
  router.get('/self/:sublist/:slug', auth, content)

  // update route
  router.patch('/self', auth, update)

  // update user avatar
  router.put('/self/avatar', setRouteVar, auth, avatar)

  // delete route
  router.delete('/self', auth, remove)

  // user submit content route
  router.post('/self/submit', auth, submit)

  // user retract content route
  router.post('/self/retract', auth, retract)
}