import {
  NextFunction,
  Request,
  Response,
  Router
} from 'express'

import * as moment from 'moment'
import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'
import '../config/passport'

import * as UTIL from '../../../common/util'
import * as CONST from '../../../common/values/constants.json'
import Logger from './Logger'

import Consumer from '../models/ConsumerModel'
import IConsumer from '../interfaces/IConsumer'

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
    let query: object = {},
      page: number = (req.query.hasOwnProperty('page')) ? parseInt(req.query.page, 10) : 0,
      count: number = (req.query.hasOwnProperty('count')) ? parseInt(req.query.count, 10) : (<any>CONST).DEFAULT_PAGE_COUNT

    Consumer
    .find(query)
    .limit((<any>CONST).DEFAULT_PAGE_COUNT)
    .select((<any>CONST).PUBLIC_CONSUMER_FIELDS)
    .exec()
    .then((data) => {
      if (data) {
        res.status(200).json(data)
      } else {
        res.status(404).send()
      }
    })
    .catch((err) => {
      res.status(res.statusCode).json(err)
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
    const handle: string = req.params.handle
    
    Consumer
    .findOne({handle})
    .select((<any>CONST).PUBLIC_CONSUMER_FIELDS)
    .then((user: IConsumer) => {
      if (user) {
        res.status(200).json({user})        
      } else {
        res.status(404).send()
      }
    })
    .catch((err) => {
      res.status(500).json({err})
    })
  }
  
  /**
   * Creates single new entry
   *
   * @class ConsumerRouter
   * @method create
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public create = (req: Request, res: Response): void => {
    let body = req.body,
      device = req.body.device,
      user: IConsumer = new Consumer(),
      method: number = -1

    // method 1: login with user handle and password
    if (UTIL.isNotUndefinedNullEmpty(body.handle)) {
      if (UTIL.isNotUndefinedNullEmpty(body.password) || body.password.length > ((<any>CONST).LIMITS.MIN_PASSWORD_LENGTH - 1)) {
        user.handle = body.handle
        user.password = body.password
        method = 1
      } else {
        res.status(401).json({code: 'VALID_PASSWORD_REQUIRED'})
      }
    // method 2: login with validated mobile number
    } else if (UTIL.isNotUndefinedNullEmpty(body.mobile) && body.mobileValidated === true) {
      user.mobile = body.mobile
      method = 2
      // method 3: login with WeChat
    } else if (UTIL.isNotUndefinedNullEmpty(body.wechat)) {
      user.wechat = body.wechat
      method = 3
    }

    if (method < 0) {
      res.status(401).json({
        code: 'LOGIN_CREDENTIALS_REQUIRED'
      })
    } else {
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
    const handle: string = req.body.handle
    
    Consumer
    .findOneAndUpdate({handle}, req.body)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({err})
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
    const handle: string = req.params.handle
    
    Consumer
    .findOneAndRemove({handle})
    .then(() => {
      res.status(204).end()
    })
    .catch((err) => {
      res.status(500).json({err})
    })
  }

  /**
   * Check if handle is available to user
   *
   * @class ConsumerRouter
   * @method handle
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public handle = (req: Request, res: Response): void => {
    let handle = req.body.handle

    Consumer
    .findOne({handle})
    .then((data) => {
      let isAvailable: boolean = !(data)
      res.status(200).json({isAvailable})
    })
    .catch((err) => {
      res.status(500).json({err})
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
      key: string = req.body.key

    if (key.length > 0) {
      switch (key) {
        case 'handle':
        default:
          let handle = req.body.handle

          // validate user handle
          if (handle.length > 0) {
            query = {handle}
          }
        break
  
        case 'email':
          let email = req.body.email

          // validate email address
          if (email.length > 0) {
            query = {email}
          }
        break
  
        case 'mobile':
          let mobile = req.body.mobile

          // validate mobile phone number
          if (mobile.length > 0) {
            query = {mobile}
          }
        break
      }

      Consumer
      .findOne(query)
      .then((data) => {
        let isUsable: boolean = !(data)
  
        res.status(200).json({
          key,
          isUsable
        })
      })
      .catch((err) => {
        res.status(500).json({err})
      })
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
    const user: IConsumer = req.user,
      token: string = this.signToken(user)

    res.status(200).json({user, token})

    new Logger({
      creator: user._id,
      type: 'CONSUMER',
      action: 'LOGIN',
      info: req.authInfo,
      device: req.body.device
    })
  }

  private createConsumer(user: IConsumer, device: object, res: Response): void {    
    user
    .save()
    .then((user: IConsumer) => {
      const token: string = this.signToken(user)
      res.status(201).json({user, token})

      new Logger({
        creator: user._id,
        type: 'CONSUMER',
        action: 'CREATE',
        device
      })        
    })
    .catch((err) => {
      res.status(500).json({err})
    })
  }

  private signToken(user: IConsumer): string {
    let now: moment.Moment = moment()
    
    return jwt.sign({
      iss: (<any>CONST).PROJECT_TITLE,
      sub: user._id,
      iat: now.valueOf(),
      exp: now.add(90, 'days').valueOf()
    }, (<any>CONST).JWT_SECRET)
  }

  public local = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate('local', {
      session: false,
      badRequestMessage: 'MISSING_CREDENTIALS'
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

  routes() {
    this.router.get('/', this.list)
    this.router.get('/:handle', this.get)
    this.router.post('/handle', this.handle)
    this.router.post('/create', this.create)
    this.router.post('/login/local', this.local, this.login)
    this.router.get('/login/token', passport.authenticate('jwt', {
      session: false
    }), this.login)
    this.router.put('/:handle', this.update)
    this.router.delete('/:handle', this.delete)
  }
}

// export
const consumerRouter = new ConsumerRouter()
consumerRouter.routes()
const thisRouter = consumerRouter.router

export default thisRouter
