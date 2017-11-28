import { NextFunction, Request, Response, Router } from 'express'

import * as debug from 'debug'
import * as mongoose from 'mongoose'

import * as UTIL from '../../../common/util'

import Log from '../models/LogModel'
import ILog from '../interfaces/ILog'

import Totp from '../models/TotpModel'
import ITotp from '../interfaces/ITotp'

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
    this.routes()
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
    .catch((err) => {
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
    .catch((err) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
  }

  routes() {
    this.router.purge('/drop/:table', this.drop)
    this.router.get('/logs', this.logs)
    this.router.get('/totp', this.totp)
  }
}

// export
const helperRouter = new HelperRouter()
helperRouter.routes()
const thisRouter = helperRouter.router

export default thisRouter
