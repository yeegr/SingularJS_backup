import {
  NextFunction,
  Request,
  Response,
  Router
} from 'express'

import * as debug from 'debug'
import * as mongoose from 'mongoose'

import * as UTIL from '../../../common/util'
import * as CONST from '../../../common/values/constants.json'
import * as JWT from 'jsonwebtoken'

import Log from '../models/LogModel'
import ILog from '../interfaces/ILog'

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
        console.log(message)
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
    let query: object = {},
      page: number = (req.query.hasOwnProperty('page')) ? parseInt(req.query.page, 10) : 0,
      count: number = (req.query.hasOwnProperty('count')) ? parseInt(req.query.count, 10) : (<any>CONST).DEFAULT_PAGE_COUNT

    Log
    .find(query)
    .limit((<any>CONST).DEFAULT_PAGE_COUNT)
    .sort({_id: -1})
    .exec()
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(res.statusCode).json(err)
    })
  }

  routes() {
    this.router.purge('/drop/:table', this.drop)
    this.router.get('/logs', this.logs)
  }
}

// export
const helperRouter = new HelperRouter()
helperRouter.routes()
const thisRouter = helperRouter.router

export default thisRouter
