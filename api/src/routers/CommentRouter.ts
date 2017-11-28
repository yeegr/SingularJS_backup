import { NextFunction, Request, Response, Router } from 'express'
import { Schema, Types } from 'mongoose'

import * as passport from 'passport'
import '../config/passport'

import * as CONST from '../../../common/options/constants'
import * as ERR from '../../../common/options/errors'
import * as UTIL from '../../../common/util'
import Logger from '../modules/logger'
import IRequest from '../interfaces/IRequest'

import Consumer from '../models/ConsumerModel'
import IConsumer from '../interfaces/IConsumer'

import Comment from '../models/CommentModel'
import IComment from '../interfaces/IComment'

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

    Comment
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
  public get(req: Request, res: Response): void {
    const id: string = req.params.id
    
    Comment
    .findById(id)
    .populate('creator', CONST.PUBLIC_CONSUMER_INFO)
    .then((comment: IComment) => {
      if (comment) {
        res.status(200).json({comment})        
      } else {
        res.status(404).send()
      }
    })
    .catch((err) => {
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
  public create(req: IRequest, res: Response): void {
    const creator: string = req.user._id,
      ref: string = req.user.ref,
      type: string = req.body.type,
      target: string = req.body.target,
      rating: number = req.body.rating,
      content: string = req.body.content,
      device: any = req.body.device

    if (!creator || !ref) {
      res.status(422).json({ message: ERR.COMMENT.COMMENT_CREATOR_REQUIRED })
    } else if (!type || !target) {
      res.status(422).json({ message: ERR.COMMENT.COMMENT_TARGET_REQUIRED })
    } else if (!content && !rating) {
      res.status(422).json({ message: ERR.COMMENT.COMMENT_CONTENT_REQUIRED })
    } else {
      const comment = new Comment({
        creator,
        ref,
        type,
        target,
        rating,
        content
      })

      comment
      .save()
      .then((data: IComment) => {
        res.status(201).json(data)
        
        new Logger({
          creator,
          ref,
          action: CONST.USER_ACTIONS.ALL.CREATE,
          type: CONST.ACTION_TARGETS.COMMENT,
          target: data._id,
          device
        })
      })
      .catch((err) => {
        res.status(res.statusCode).send()
        console.log(err)
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
  public update(req: Request, res: Response): void {
    const user: IConsumer = req.user,
      creator: Schema.Types.ObjectId = user._id,
      ref: string = user.ref,
      _id: string = req.params.id,
      body: any = req.body,
      rating: number = body.rating,
      content: string = body.content,
      device: any = body.device

    if (!creator || !ref) {
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
            res.status(200).json(data)
            
            new Logger({
              creator,
              ref,
              action: CONST.USER_ACTIONS.ALL.UPDATE,
              type: CONST.ACTION_TARGETS.COMMENT,
              target: data._id,
              device
            })
          })
        } else {
          res.status(404).send()
        }
      })
      .catch((err) => {
        res.status(res.statusCode).send()
        console.log(err)
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
  public delete(req: Request, res: Response): void {
    const user: IConsumer = req.user,
      creator: Schema.Types.ObjectId = user._id,
      ref: string = user.ref,
      _id: string = req.params.id,
      device: any = req.body.device

    Comment
    .findOneAndRemove({creator, _id})
    .then((data: IComment) => {
      if (data) {
        res.status(204).end()
        
        new Logger({
          creator,
          ref,
          action: CONST.USER_ACTIONS.ALL.DELETE,
          type: CONST.ACTION_TARGETS.COMMENT,
          target: data._id,
          device
        })        
      } else {
        res.status(404).send()
      }
    })
    .catch((err) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
  }

  routes() {
    this.router.get('/', this.list)
    this.router.get('/:id', this.get)

    // create route
    this.router.post('/', passport.authenticate('jwt', {
      session: false
    }), this.create)

    // update route
    this.router.patch('/:id', passport.authenticate('jwt', {
      session: false
    }), this.update)

    // delete route
    this.router.delete('/:id', passport.authenticate('jwt', {
      session: false
    }), this.delete)
  }
}

// export
const commentRouter = new CommentRouter()
commentRouter.routes()
const thisRouter = commentRouter.router

export default thisRouter
