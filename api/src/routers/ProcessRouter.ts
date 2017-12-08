import { NextFunction, Request, Response, Router } from 'express'
import { Schema, Types } from 'mongoose'

import * as passport from 'passport'
import '../config/passport/platform'

import { CONST, ERRORS, UTIL } from '../../../common'
import { Logger, Err } from '../modules'

import IUser from '../interfaces/users/IUser'
import Process, { IProcess } from '../models/workflow/ProcessModel'
import Activity, { IActivity } from '../models/workflow/ActivityModel'

/**
 * ProcessRouter class
 *
 * @class ProcessRouter
 */
class ProcessRouter {
  router: Router

  /**
   * Constructor
   *
   * @class ProcessRouter
   * @constructor
   */
  constructor() {
    this.router = Router()
    this.routes()
  }

  /**
   * List processes
   *
   * @class ProcessRouter
   * @method list
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public list = (req: Request, res: Response): void => {
    let params: any = UTIL.assembleSearchParams(req, {}, '')

    if (req.query.status) {
      params.query.status = req.query.status
    }

    if (req.query.type) {
      params.query.targetRef = UTIL.capitalizeFirstLetter(req.query.type, true)
    }

    Process
    .find(params.query)
    .skip(params.skip)
    .limit(params.limit)
    .sort(params.sort)
    .populate('creator', CONST.BASIC_USER_INFO)
    .populate('target', CONST.BASIC_CONTENT_INFO)
    .populate({
      path: 'activities',
      populate: [{
        path: 'creator',
        select: CONST.BASIC_USER_INFO
      }, {
        path: 'target',
        select: CONST.BASIC_CONTENT_INFO
      }, {
        path: 'handler',
        select: CONST.BASIC_USER_INFO
      }]
    })
    .lean()
    .exec()
    .then((arr: any[]) => {
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
   * Gets single entry by id
   *
   * @class ProcessRouter
   * @method get
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public get = (req: Request, res: Response): void => {
    const id: string = req.params.process_id
    
    Process
    .findById(id)
    .populate('creator', CONST.BASIC_USER_INFO)
    .populate('target', CONST.BASIC_CONTENT_INFO)
    .populate({
      path: 'activities',
      populate: [{
        path: 'creator',
        select: CONST.BASIC_USER_INFO
      }, {
        path: 'target',
        select: CONST.BASIC_CONTENT_INFO
      }, {
        path: 'handler',
        select: CONST.BASIC_USER_INFO
      }]
    })
    .lean()
    .exec()
    .then((process: IProcess) => {
      if (process) {
        res.status(200).json(process)        
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
   * Updates activity/process
   *
   * @class ProcessRouter
   * @method update
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  
  public update = (req: Request, res: Response): void => {
    const user: IUser = req.user,
      process_id = req.params.process_id,
      activity_id = req.params.activity_id,
      now = UTIL.getTimestamp(),
      body: any = req.body

    let query: any = {
        _id: activity_id,
        state: CONST.ACTIVITY_STATES.PROCESSING
      },
      update: any = {},
      log = {
        creator: user._id,
        creatorRef: user.ref,
        action: body.action,
        ua: req.body.ua || req.ua
      }

    switch (body.action) {
      case CONST.USER_ACTIONS.PLATFORM.HOLD:
        update = {
          handler: user._id,
          handlerRef: user.ref,
          processedAt: now,
          state: CONST.ACTIVITY_STATES.PROCESSING
        }

        query.state = CONST.ACTIVITY_STATES.READY
      break

      case CONST.USER_ACTIONS.PLATFORM.CANCEL:
        update = {
          handler: null,
          handlerRef: null,
          processedAt: null,
          state: CONST.ACTIVITY_STATES.READY
        }
      break

      case CONST.USER_ACTIONS.PLATFORM.APPROVE:
        update = {
          handler: user._id,
          handlerRef: user.ref,
          processedAt: now,
          state: CONST.ACTIVITY_STATES.COMPLETED,
          comment: body.comment,
          assignedStatus: CONST.STATUSES.CONTENT.APPROVED
        }
      break

      case CONST.USER_ACTIONS.PLATFORM.REJECT:
        update = {
          handler: user._id,
          handlerRef: user.ref,
          processedAt: now,
          state: CONST.ACTIVITY_STATES.COMPLETED,
          comment: body.comment,
          assignedStatus: CONST.STATUSES.CONTENT.REJECTED
        }
      break
    }

    Activity
    .findOneAndUpdate(query, update, {new: true})
    .then((activity: IActivity) => {
      if (activity) {
        new Logger(Object.assign({}, log, {
          target: activity_id,
          targetRef: CONST.ACTION_TARGETS.ACTIVITY
        }))

        if (activity.state === CONST.ACTIVITY_STATES.COMPLETED) {
          return Process.findById(process_id)
        } else {
          res.status(200).json(activity)
          return null
        }
      } else {
        res.status(400).json({ message: ERRORS.PROGRESS.ACTIVITY_IS_LOCKED })
        return null
      }
    })
    .then((process: IProcess) => {
      if (process) {
        if (body.isFinal) {
          return process.finalize(update.assignedStatus)
        } else {
          return process.addActivity({
            creator: user._id,
            creatorRef: user.ref,
            target: process.target,
            targetRef: process.targetRef,
            action: CONST.USER_ACTIONS.PLATFORM.REQUEST,
            initStatus: update.assignedStatus
          })
        }
      }
    })
    .then((process: IProcess) => {
      if (process) {
        res.status(200).json(process)
        
        // log process update
        new Logger(Object.assign({}, log, {
          target: process_id,
          targetRef: CONST.ACTION_TARGETS.PROCESS,
          state: process.status
        }))
      }
    })
    .catch((err: Error) => {
      new Err(res, err, log)
    })
  }

  routes() {
    // lists workflow processes
    this.router.get('/', passport.authenticate('platformJwt', {
      session: false
    }), this.list)
    
    // gets specific workflow process
    this.router.get('/:process_id', passport.authenticate('platformJwt', {
      session: false
    }), this.get)
        
    // updates specific workflow process
    this.router.patch('/:process_id/:activity_id', passport.authenticate('platformJwt', {
      session: false
    }), this.update)

  }
}

// export
const processRouter = new ProcessRouter()
processRouter.routes()
const thisRouter = processRouter.router

export default thisRouter
