import { NextFunction, Request, Response, Router } from 'express'
import { Schema, Types } from 'mongoose'

import * as passport from 'passport'
import '../config/passport/consumer'

import * as CONST from '../../../common/options/constants'
import * as ERR from '../../../common/options/errors'
import * as UTIL from '../../../common/util'
import Logger from '../modules/logger'
import Err from '../modules/err'

import Consumer from '../models/users/ConsumerModel'
import IConsumer from '../interfaces/users/IConsumer'

import Comment from '../models/share/CommentModel'
import IComment from '../interfaces/share/IComment'

/**
 * CommentRouter class
 *
 * @class CommentRouter
 */
class CommentRouter {
  router: Router

  /**
   * Constructor
   *
   * @class CommentRouter
   * @constructor
   */
  constructor() {
    this.router = Router()
    this.routes()
  }

  /**
   * List search results
   *
   * @class CommentRouter
   * @method list
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public list = (req: Request, res: Response): void => {
    let params = UTIL.assembleSearchParams(req, {}, 'content')

    Comment
    .find(params.query)
    .skip(params.skip)
    .limit(params.limit)
    .sort(params.sort)
    .populate('creator', CONST.PUBLIC_CONSUMER_INFO_LIST)
    .lean()
    .exec()
    .then((arr) => {
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
   * @class CommentRouter
   * @method get
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public get = (req: Request, res: Response): void => {
    const id: string = req.params.id
    
    Comment
    .findById(id)
    .populate('creator', CONST.PUBLIC_CONSUMER_INFO)
    .lean()
    .exec()
    .then((comment: IComment) => {
      if (comment) {
        res.status(200).json(comment)        
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
   * Creates single new entry
   *
   * @class CommentRouter
   * @method create
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public create = (req: Request, res: Response): void => {
    const creator: string = req.user._id,
      creatorRef: string = req.user.ref,
      target: string = req.body.target,
      targetRef: string = req.body.targetRef,
      rating: number = req.body.rating,
      content: string = req.body.content

    if (!creator || !creatorRef) {
      res.status(422).json({ message: ERR.COMMENT.COMMENT_CREATOR_REQUIRED })
    } else if (!targetRef || !target) {
      res.status(422).json({ message: ERR.COMMENT.COMMENT_TARGET_REQUIRED })
    } else if (!content && !rating) {
      res.status(422).json({ message: ERR.COMMENT.COMMENT_CONTENT_REQUIRED })
    } else {
      const comment = new Comment({
        creator,
        creatorRef,
        target,
        targetRef,
        rating,
        content
      })
      
      let log = {
        creator,
        creatorRef,
        action: CONST.USER_ACTIONS.COMMON.CREATE,
        targetRef: CONST.ACTION_TARGETS.COMMENT,
        ua: req.body.ua || req.ua
      }

      comment
      .save()
      .then((data: IComment) => {
        res.status(201).json(data)
        
        new Logger(Object.assign({}, log, {
          target: data._id
        }))
      })
      .catch((err: Error) => {
        console.log(err)
        new Err(res, err, log)
      })
    }
  }
  
  /**
   * Updates entry by id
   *
   * @class CommentRouter
   * @method update
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public update = (req: Request, res: Response): void => {
    const user: IConsumer = req.user,
      creator: Schema.Types.ObjectId = user._id,
      creatorRef: string = user.ref,
      _id: string = req.params.id,
      body: any = req.body,
      rating: number = body.rating,
      content: string = body.content,
      log = {
        creator,
        creatorRef,
        action: CONST.USER_ACTIONS.COMMON.UPDATE,
        targetRef: CONST.ACTION_TARGETS.COMMENT,
        target: _id,
        ua: req.body.ua || req.ua
      }

    if (!creator || !creatorRef) {
      res.status(422).json({ message: ERR.COMMENT.COMMENT_CREATOR_REQUIRED })
    } else if (!_id) {
      res.status(422).json({ message: ERR.COMMENT.COMMENT_TARGET_REQUIRED })
    } else if (!content && !rating) {
      res.status(422).json({ message: ERR.COMMENT.COMMENT_CONTENT_REQUIRED })
    } else {
      Comment
      .findOne({creator, _id})
      .then((data: IComment) => {
        if (data) {
          data.diff = body.rating - data.rating
          data.rating = body.rating
          data.content = body.content

          data
          .save()
          .then((comment: IComment) => {
            res.status(200).json(comment)
            new Logger(log)
          })
        } else {
          res.status(404).send()
        }
      })
      .catch((err: Error) => {
        new Err(res, err, log)
      })
    }
  }  
  
  /**
   * Deletes entry by id
   *
   * @class CommentRouter
   * @method delete
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public delete = (req: Request, res: Response): void => {
    const user: IConsumer = req.user,
      creator: Schema.Types.ObjectId = user._id,
      creatorRef: string = user.ref,
      _id: string = req.params.id,
      log = {
        creator,
        creatorRef: user.ref,
        action: CONST.USER_ACTIONS.COMMON.DELETE,
        targetRef: CONST.ACTION_TARGETS.COMMENT,
        target: _id,
        ua: req.body.ua || req.ua
      }

    if (!creator || !creatorRef) {
      res.status(422).json({ message: ERR.COMMENT.COMMENT_CREATOR_REQUIRED })
    } else if (!_id) {
      res.status(422).json({ message: ERR.COMMENT.COMMENT_TARGET_REQUIRED })
    } else {
      Comment
      .findOneAndRemove({creator, _id})
      .then((data: IComment) => {
        if (data) {
          res.status(204).end()
          new Logger(log)        
        } else {
          res.status(404).send()
        }
      })
      .catch((err: Error) => {
        new Err(res, err, log)
      })
    }
  }

  routes() {
    this.router.get('/', this.list)
    this.router.get('/:id', this.get)

    // create route
    this.router.post('/', passport.authenticate('consumerJwt', {
      session: false
    }), this.create)

    // update route
    this.router.patch('/:id', passport.authenticate('consumerJwt', {
      session: false
    }), this.update)

    // delete route
    this.router.delete('/:id', passport.authenticate('consumerJwt', {
      session: false
    }), this.delete)
  }
}

// export
const commentRouter = new CommentRouter()
commentRouter.routes()
const thisRouter = commentRouter.router

export default thisRouter
