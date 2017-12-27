import { Request, Response, NextFunction, Router } from 'express'

import * as debug from 'debug'
import * as mongoose from 'mongoose'

import { UTIL } from '../../../common'

import Consumer from '../models/users/ConsumerModel'
import IAction from '../interfaces/actions/IAction'
import Log, { ILog } from '../models/LogModel'
import Err, { IErr } from '../models/ErrModel'
import Totp, { ITotp } from '../models/users/TotpModel'

/**
 * HelperRouter class
 *
 * @class HelperRouter
 */
class HelperRouter {
  router: Router

  /**
   * Constructor
   *
   * @class HelperRouter
   * @constructor
   */
  constructor() {
    this.router = Router()
  }

  /**
   * Drop collections - for testing only
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @returns {void}
   */
  public drop(req: Request, res: Response): void {
    const remoteAddress: string = req.connection.remoteAddress,
      ip = remoteAddress.substring(remoteAddress.lastIndexOf(':') + 1)
  
    let name = req.params.table,
      query = (name === 'all') ? {} : {name},
      message = '************************************************************',
      breaker = '\n************************************************************'
  
    mongoose.connection.db.listCollections(query).toArray((err: Error, arr: object[]) => {
      if (err) { console.log(err) }

      if (arr.length > 0) {
        arr.forEach((t:any, i:number) => {
          mongoose.connection.collections[t.name].drop((err: Error) => {
            message += '\n' + 'The [' + t.name + '] collection is dropped @ ' + ip
  
            if (i === (arr.length - 1)) {
              message += breaker
              console.log(message)
              res.status(204).send()           
            }
          })
        })  
      } else {
        if (name === 'all') {
          message += '\n' + 'The database is empty, nothing to drop!'                    
        } else {
          message += '\n' + 'The [' + name + '] collection is not found, nothing to drop!'          
        }

        message += breaker
        res.status(204).send()           
      }
    })
  }

  /**
   * List logs, default to descending order
   *
   * @class HelperRouter
   * @method logs
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public logs = (req: Request, res: Response): void => {
    const query = {},
      page: number = UTIL.getListPageIndex(req),
      count: number = UTIL.getListCountPerPage(req)
    
    Log
    .find(query)
    .skip(page * count)
    .limit(count)
    .sort({_id: -1})
    .exec()
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err: Error) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
  }

  public errs = (req: Request, res: Response): void => {
    const query = {},
      page: number = UTIL.getListPageIndex(req),
      count: number = UTIL.getListCountPerPage(req)
    
    Err
    .find(query)
    .skip(page * count)
    .limit(count)
    .sort({_id: -1})
    .exec()
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err: Error) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
  }

  public actions = (req: Request, res: Response): void => {
    const ActionModel = UTIL.getModelFromAction(req.params.action),
      params = UTIL.assembleSearchParams(req)

    ActionModel
    .find(params.query)
    .skip(params.skip)
    .limit(params.limit)
    .sort({_id: -1})
    .exec()
    .then((data: IAction) => {
      res.status(200).json(data)
    })
    .catch((err: Error) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
  }

  public totp = (req: Request, res: Response): void => {
    const query = {},
      page: number = UTIL.getListPageIndex(req),
      count: number = UTIL.getListCountPerPage(req),
      match: string = (req.query.hasOwnProperty('match')) ? req.query.match : null

    Totp
    .find(query)
    .skip(page * count)
    .limit(count)
    .sort({_id: -1})
    .exec()
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err: Error) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
  }

  public consumers = (req: Request, res: Response): void => {
    Consumer
    .find()
    .select('username handle email mobile')
    .sort({_id: -1})
    .lean()
    .exec()
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err: Error) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
  }

  routes() {
    this.router.purge('/drop/:table', this.drop)
    this.router.get('/consumers', this.consumers)
    this.router.get('/logs', this.logs)
    this.router.get('/errs', this.errs)
    this.router.get('/totp', this.totp)
    this.router.get('/actions/:action', this.actions)
  }
}

// export
const helperRouter = new HelperRouter()
helperRouter.routes()
const thisRouter = helperRouter.router

export default thisRouter
