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
import * as CONFIG from '../../../common/options/config'
import * as CONST from '../../../common/options/constants'
import Logger from './_Logger'

import Consumer from '../models/ConsumerModel'
import IConsumer from '../interfaces/IConsumer'

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
    let query: object = {},
      page: number = UTIL.getListPageIndex(req),
      count: number = UTIL.getListCountPerPage(req),
      sort: any = UTIL.getListSort(req)

    Consumer
    .find(query)
    .skip(page * count)
    .limit(count)
    // .select(CONST.PUBLIC_CONSUMER_INFO_LIST)
    .sort(sort)
    .exec()
    .then((arr: IConsumer[]) => {
      if (arr) {
        res.status(200).json(arr)
      } else {
        res.status(404).send()
      }
    })
    .catch((err) => {
      res.status(res.statusCode).json({err})
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
    .findOneAndUpdate({handle}, {$inc: {totalViews: 1}}, {new: true})
    .select(CONST.PUBLIC_CONSUMER_INFO)
    .then((user: IConsumer) => {
      if (user) {
        res.status(200).json({user})
      } else {
        res.status(404).send()
      }
    })
    .catch((err) => {
      res.status(res.statusCode).json({err})
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
      value: any = tuple[0]

    if (key.length > 0) {
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
          if (UTIL.validateEmail(value)) {
            query = {email: value}
          }
        break
  
        case 'mobile':
          value = UTIL.normalizeMobile(value)

          // validate mobile phone number
          if (UTIL.validateMobile(value)) {
            query = {mobile: value}
          }
        break
      }

      Consumer
      .findOne(query)
      .then((data) => {
        let isAvailable: boolean = !(data)
        res.status(200).json({isAvailable})
      })
      .catch((err) => {
        res.status(res.statusCode).json({err})
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

    if (UTIL.isNotUndefinedNullEmpty(body.handle)) {
      if (UTIL.isNotUndefinedNullEmpty(body.password) || UTIL.validatePassword(body.password)) {
        let user: IConsumer = new Consumer({
          handle: body.handle,
          password: body.password
        })
        this.createConsumer(user, device, res)
      } else {
        res.status(401).json({code: 'VALID_PASSWORD_REQUIRED'})
      }
    } else {
      res.status(401).json({
        code: 'LOGIN_CREDENTIALS_REQUIRED'
      })      
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
      .findOneAndUpdate({_id}, req.body, {new: true})
      .then((user: IConsumer) => {
        if (user) {
          let token: string = this.signToken(user)
          res.status(200).json({user, token})
  
          new Logger({
            creator: _id,
            type: 'CONSUMER',
            action: 'UPDATE',
            target: 'CONSUMER',
            ref: user._id,
            device
          })
        } else {
          res.status(404).send()
        }
      })
      .catch((err) => {
        res.status(res.statusCode).json({err})
      })
    } else {
      res.status(401).json({
        message: 'PERMISSION_DENIED'
      })
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
      .findOneAndRemove({_id})
      .then((user: IConsumer) => {
        if (user) {
          res.status(204).end()
          
          new Logger({
            creator: _id,
            type: 'CONSUMER',
            action: 'DELETE',
            target: 'CONSUMER',
            ref: user._id,
            device
          })        
        } else {
          res.status(404).send()
        }
      })
      .catch((err) => {
        res.status(res.statusCode).json({err})
      })
    } else {
      res.status(401).json({
        message: 'PERMISSION_DENIED'
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
      res.status(res.statusCode).json({err})
    })
  }

  /**
   * Signs a token using user id
   * 
   * @param {IConsumer} user 
   */
  private signToken(user: IConsumer): string {
    let now: moment.Moment = moment()
    
    return jwt.sign({
      iss: CONFIG.PROJECT_TITLE,
      sub: user._id,
      iat: now.valueOf(),
      exp: now.add(90, 'days').valueOf()
    }, CONFIG.JWT_SECRET)
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
      action: CONST.USER_ACTIONS.CONSUMER.LOGIN,
      code: UTIL.getRandomNumericString(4)
    }, req.body))

    totp
    .save()
    .then((data) => {
      let sms = new SMS({'content':'something'})
      // sms.send({'content':'something'})

      res.status(201).send('Success')
    })
    .catch((err) => {
      res.status(res.statusCode).json({err})
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
          let token: string = this.signToken(user)
          res.status(200).json({user, token})
        } else {
          let user: IConsumer = new Consumer(query)
          this.createConsumer(user, req.body.device, res)
        }
      })
    })
    .catch((err) => {
      res.status(res.statusCode).json({err})
    })
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
    this.router.post('/login/local', this.local, this.login)
    this.router.post('/login/totp', this.initTotp)
    this.router.patch('/login/totp', this.verifyTotp)
    this.router.get('/login/token', passport.authenticate('jwt', {
      session: false
    }), this.login)

    // update route
    this.router.patch('/:handle', passport.authenticate('jwt', {
      session: false
    }), this.update)

    // delete route
    this.router.delete('/:handle', passport.authenticate('jwt', {
      session: false
    }), this.delete)
  }
}

// export
const consumerRouter = new ConsumerRouter()
consumerRouter.routes()
const thisRouter = consumerRouter.router

export default thisRouter
