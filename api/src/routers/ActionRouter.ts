import { NextFunction, Request, Response, Router } from 'express'
import { Schema, NativeError } from 'mongoose'

import * as passport from 'passport'
import '../config/passport/consumer'

import * as CONST from '../../../common/options/constants'
import * as ERR from '../../../common/options/errors'
import * as UTIL from '../../../common/util'
import Logger from '../modules/logger'
import IRequest from '../interfaces/IRequest'

import Consumer from '../models/users/ConsumerModel'
import IConsumer from '../interfaces/users/IConsumer'

import IAction from '../interfaces/actions/IAction'

import Log from '../models/LogModel'
import ILog from '../interfaces/ILog'

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
   * Creates single new entry
   *
   * @class ActionRouter
   * @method create
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public create = (req: IRequest, res: Response) => {
    const creator: Schema.Types.ObjectId = req.user._id,
      ref: string = req.user.ref,
      type: string = UTIL.capitalizeFirstLetter(req.body.type),
      target: Schema.Types.ObjectId = req.body.target,
      action: string = req.body.action,
      device: any = req.body.device

    if (!creator || !ref) {
      res.status(422).json({ message: ERR.ACTION.ACTION_CREATOR_REQUIRED })
    } else if (!type || !target) {
      res.status(422).json({ message: ERR.ACTION.ACTION_TARGET_NOT_SPECIFIED })
    } else if (CONST.ACTION_TARGETS_ENUM.indexOf(type) < 0) {
      res.status(400).json({ message: ERR.ACTION.ACTION_TARGET_NOT_FOUND })
    } else if (!action) {
      res.status(422).json({ message: ERR.ACTION.ACTION_TYPE_REQUIRED })
    } else if (ref === CONST.USER_TYPES.CONSUMER && CONST.CONSUMER_USER_ACTIONS_ENUM.indexOf(action) < 0) {
      res.status(400).json({ message: ERR.ACTION.ACTION_TYPE_NOT_FOUND })
    } else {
      let ActionModel = UTIL.getModelFromAction(action),
        TargetModel = UTIL.getModelFromKey(type),
        query = {
          creator,
          ref,
          type,
          target
        },
        log = {
          creator,
          ref,
          type,
          target,
          action,
          device
        },
        data = new ActionModel(query)

      /**
       * Duplidates of 
       * LIKE, UNDO_LIKE, 
       * DISLIKE, UNDO_DISLIKE, 
       * SAVE, UNDO_SAVE, 
       * FOLLOW, UNFOLLOW
       * are ignored
       * 
       * Duplicates of 
       * SHARE, Download
       * are permitted
       */
      if (action === CONST.USER_ACTIONS.CONSUMER.SHARE || action === CONST.USER_ACTIONS.CONSUMER.DOWNLOAD) {
        data
        .save()
        .then((act: IAction) => {
          res.status(res.statusCode).send()
          this.logger(log)
        })
        .catch((err: Error) => {
          res.status(res.statusCode).send()
          console.log(err)
        })
      } else {
        TargetModel
        .findById(target)
        .select('creator')
        .then((doc: any) => {
          if (doc) {
            if ((<any>creator).equals(doc.creator)) {
              res.status(422).json({ message: ERR.ACTION.ACTION_NOT_AUTHORIZED})
            } else {
              switch (action) {
                case CONST.USER_ACTIONS.CONSUMER.UNDO_LIKE:
                case CONST.USER_ACTIONS.CONSUMER.UNDO_DISLIKE:
                case CONST.USER_ACTIONS.CONSUMER.UNDO_SAVE:
                case CONST.USER_ACTIONS.CONSUMER.UNFOLLOW:
                  ActionModel
                  .findOneAndRemove(query)
                  .then((act: IAction) => {
                    if (!act) {
                      res.status(404).json({ message: ERR.ACTION.CANNOT_UNDO_NON_ACTION })
                    } else {
                      res.status(res.statusCode).send()                      
                      this.logger(log)
                    }
                  })
                  .catch((err: Error) => {
                    res.status(res.statusCode).send()
                    console.log(err)
                  })
                break
  
                case CONST.USER_ACTIONS.CONSUMER.LIKE:
                case CONST.USER_ACTIONS.CONSUMER.DISLIKE:
                case CONST.USER_ACTIONS.CONSUMER.SAVE:
                case CONST.USER_ACTIONS.CONSUMER.FOLLOW:
                  data
                  .save()
                  .then((act: IAction) => {
                    res.status(201).send()
                    this.logger(log)
                  })
                  .catch((err: Error) => {
                    UTIL.formatError(res, err, action)
                  })
                break

                default:
                  res.status(422).json({ message: ERR.ACTION.UNABLE_TO_PERFORM_ACTION })
                break
              }
            }
          } else {
            res.status(404).json({ message: ERR.ACTION.ACTION_TARGET_NOT_FOUND })
          }
        })
        .catch((err: Error) => {
          res.status(404).send()
          console.log(err)
        })
      }
    }
  }

  private logger = (log: any) => {
    new Logger(log)
  }

  routes() {
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
