import {
  NextFunction,
  Request,
  Response,
  Router
} from 'express'

import { Schema, NativeError } from 'mongoose'

import * as passport from 'passport'
import '../config/passport'

import * as CONST from '../../../common/options/constants'
import * as UTIL from '../../../common/util'
import Logger from './_Logger'

import Consumer from '../models/ConsumerModel'
import IConsumer from '../interfaces/IConsumer'

import Log from '../models/LogModel'
import ILog from '../interfaces/ILog'

import IRequest from '../interfaces/IRequest'

/**
 * ActionRouter class
 *
 * @class ActionRouter
 */
class ActionRouter {
  router: Router

  /**
   * Constructor
   *
   * @class ActionRouter
   * @constructor
   */
  constructor() {
    this.router = Router()
    this.routes()
  }

  /**
   * List search results
   *
   * @class ActionRouter
   * @method list
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public list(req: IRequest, res: Response): void {
    let query: any = {},
      page: number = UTIL.getListPageIndex(req),
      count: number = UTIL.getListCountPerPage(req),
      sort: any = UTIL.getListSort(req),
      fields: string = UTIL.getRequestParam(req, 'on') || 'content'

    if (UTIL.isNotUndefinedNullEmpty(UTIL.getRequestParam(req, 'in'))) {
      query = Object.assign(query, UTIL.getListArray(req, 'in'))      
    }
      
    if (UTIL.isNotUndefinedNullEmpty(UTIL.getRequestParam(req, 'keywords'))) {
      query = Object.assign(query, UTIL.getListKeywordQuery(req, fields))
    }
    
    Log
    .find(query)
    .skip(page * count)
    .limit(count)
    .sort(sort)
    .populate('creator', CONST.PUBLIC_CONSUMER_INFO_LIST)
    .exec()
    .then((arr) => {
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
   * Gets single entry by param of 'slug'
   *
   * @class ActionRouter
   * @method get
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public get(req: Request, res: Response): void {
    const id: string = req.params.id
    
    Log
    .findById(id)
    .populate('creator', CONST.PUBLIC_CONSUMER_INFO)
    .then((log: ILog) => {
      if (log) {
        res.status(200).json({log})        
      } else {
        res.status(404).send()
      }
    })
    .catch((err) => {
      res.status(res.statusCode).json({err})
    })
  }

  /**
   * Creates single new entry
   *
   * @class ActionRouter
   * @method create
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public create(req: IRequest, res: Response) {
    const creator: string = req.user._id,
      type: string = req.user.type,
      target: string = UTIL.capitalizeFirstLetter(req.body.target.toLocaleLowerCase()),
      ref: Schema.Types.ObjectId = req.body.ref,
      action: string = req.body.action,
      device: any = req.body.device

    if (!creator || !type) {
      res.status(422).json({ message: 'ACTION_CREATOR_REQUIRED' })
    } else if (!type || !ref) {
      res.status(422).json({ message: 'ACTION_TARGET_REQUIRED' })
    } else if (!action) {
      res.status(422).json({ message: 'ACTION_NAME_REQUIRED' })
    } else {
      let logger: Function = (good2go: boolean = false) => {
        if (good2go) {
          let log: ILog = new Log({
            creator,
            type,
            target,
            ref,
            action,
            device
          })
  
          log
          .save()
          .then((data: ILog) => {
            res.status(201).json({log: data})
          })
        } else {
          res.status(422).json({ message: 'DUPLICATED_ACTION' })
        }
      }
        
      let CreatorModel = UTIL.selectDataModel(type),
        key = UTIL.getKeyFromAction(action)

      CreatorModel
      .findById(creator)
      .then((user: any) => {
        switch (action) {
          case CONST.USER_ACTIONS.CONSUMER.LIKE:
          case CONST.USER_ACTIONS.CONSUMER.DISLIKE:
          case CONST.USER_ACTIONS.CONSUMER.SAVE:
          case CONST.USER_ACTIONS.CONSUMER.SHARE:
          case CONST.USER_ACTIONS.CONSUMER.DOWNLOAD:
            user.addToArray(key, target, ref, logger)
          break

          case CONST.USER_ACTIONS.CONSUMER.UNDO_LIKE:
          case CONST.USER_ACTIONS.CONSUMER.UNDO_DISLIKE:
          case CONST.USER_ACTIONS.CONSUMER.UNDO_SAVE:
            user.removeFromArray(key, target, ref, logger)
          break

          case CONST.USER_ACTIONS.CONSUMER.FOLLOW:
            user.addToList(key, ref, logger)
          break

          case CONST.USER_ACTIONS.CONSUMER.UNFOLLOW:
            user.removeFromList(key, ref, logger)
          break
        }
      })
      .catch((err: NativeError) => {
        console.log(err)
      })
    }
  }


  routes() {
    this.router.get('/', this.list)
    this.router.get('/:id', this.get)

    // create route
    this.router.post('/', passport.authenticate('jwt', {
      session: false
    }), this.create)
  }
}

// export
const actionRouter = new ActionRouter()
actionRouter.routes()
const thisRouter = actionRouter.router

export default thisRouter
