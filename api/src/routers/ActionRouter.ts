import { NextFunction, Request, Response, Router } from 'express'
import { Schema, NativeError } from 'mongoose'

import * as passport from 'passport'
import '../config/passport/consumer'

import { CONST, UTIL, ERRORS } from '../../../common'
import { Logger, Err } from '../modules'

import Consumer from '../models/users/ConsumerModel'
import IAction from '../interfaces/actions/IAction'

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
  public create = (req: Request, res: Response) => {
    const creator: Schema.Types.ObjectId = req.user._id,
      creatorRef: string = req.user.ref,
      target: Schema.Types.ObjectId = req.body.target,
      targetRef: string = UTIL.capitalizeFirstLetter(req.body.type),
      action: string = req.body.action

    if (!creator || !creatorRef) {
      res.status(422).json({ message: ERRORS.ACTION.ACTION_CREATOR_REQUIRED })
    } else if (!targetRef || !target) {
      res.status(422).json({ message: ERRORS.ACTION.ACTION_TARGET_NOT_SPECIFIED })
    } else if (CONST.ACTION_TARGETS_ENUM.indexOf(targetRef) < 0) {
      res.status(400).json({ message: ERRORS.ACTION.ACTION_TARGET_NOT_FOUND })
    } else if (!action) {
      res.status(422).json({ message: ERRORS.ACTION.ACTION_TYPE_REQUIRED })
    } else if (creatorRef === CONST.USER_TYPES.CONSUMER && CONST.CONSUMER_USER_ACTIONS_ENUM.indexOf(action) < 0) {
      res.status(400).json({ message: ERRORS.ACTION.ACTION_TYPE_NOT_FOUND })
    } else {
      let ActionModel = UTIL.getModelFromAction(action),
        TargetModel = UTIL.getModelFromName(targetRef),
        query = {
          creator,
          creatorRef,
          target,
          targetRef
        },
        log = {
          creator,
          creatorRef,
          target,
          targetRef,
          action,
          ua: req.body.ua || req.ua
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
              res.status(422).json({ message: ERRORS.ACTION.ACTION_NOT_AUTHORIZED})
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
                      res.status(404).json({ message: ERRORS.ACTION.CANNOT_UNDO_NON_ACTION })
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
                  res.status(422).json({ message: ERRORS.ACTION.UNABLE_TO_PERFORM_ACTION })
                break
              }
            }
          } else {
            res.status(404).json({ message: ERRORS.ACTION.ACTION_TARGET_NOT_FOUND })
          }
        })
        .catch((err: Error) => {
          new Err(res, err, log)
        })
      }
    }
  }

  private logger = (log: any) => {
    new Logger(log)
  }

  routes() {
    // create route
    this.router.post('/', passport.authenticate('consumerJwt', {
      session: false
    }), this.create)
  }
}

// export
const actionRouter = new ActionRouter()
actionRouter.routes()
const thisRouter = actionRouter.router

export default thisRouter
