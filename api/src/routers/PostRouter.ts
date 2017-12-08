import { NextFunction, Request, Response, Router } from 'express'
import { Schema, Types } from 'mongoose'

import * as validator from 'validator'
import * as passport from 'passport'
import '../config/passport/consumer'

import { CONFIG, CONST, ERRORS, UTIL } from '../../../common'
import { Logger, Err } from '../modules'

import Processor from '../modules/process'
import Process, { IProcess } from '../models/workflow/ProcessModel'
import Activity, { IActivity } from '../models/workflow/ActivityModel'

import Consumer from '../models/users/ConsumerModel'
import IUser from '../interfaces/users/IUser'

import Post, { IPost } from '../models/post/PostModel'

/**
 * PostRouter class
 *
 * @class PostRouter
 */
class PostRouter {
  router: Router

  /**
   * Constructor
   *
   * @class PostRouter
   * @constructor
   */
  constructor() {
    this.router = Router()
    this.routes()
  }

  /**
   * Intializes listing
   *
   * @class PostRouter
   * @method search
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public list = (req: Request, res: Response): void => {
    let handle: string = UTIL.getRequestParam(req, 'author')

    if (handle && handle.length > 0) {
      Consumer
      .findOne({handle})
      .select('_id')
      .lean()
      .then((user: IUser) => {
        if (user) {
          this.search(req, res, user._id)
        } else {
          res.status(404).json({ message: ERRORS.USER.USER_NOT_FOUND })
        }
      })
      .catch((err: Error) => {
        res.status(res.statusCode).send()
        console.log(err)
      })
    } else {
      this.search(req, res)
    }
  }

  /**
   * Returns listing results
   *
   * @class PostRouter
   * @method list
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  private search = (req: Request, res: Response, creator?: Schema.Types.ObjectId) => {
    let params = UTIL.assembleSearchParams(req, {
        status: CONST.STATUSES.CONTENT.APPROVED
      }, 'title excerpt content')

    if (creator) {
      params.query.creator = creator
    }

    Post
    .find(params.query)
    .skip(params.skip)
    .limit(params.limit)
    .sort(params.sort)
    .populate({
      path: 'creator',
      model: CONST.USER_TYPES.CONSUMER,
      select: CONST.PUBLIC_CONSUMER_INFO_LIST
    })
    .lean()
    .exec()
    .then((data: IPost[]) => {
      if (data) {
        res.status(200).json(data)        
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
   * Gets single entry by param of 'slug'
   *
   * @class PostRouter
   * @method get
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public get = (req: Request, res: Response): void => {
    Post
    .findOneAndUpdate({
      slug: req.params.slug,
      status: CONST.STATUSES.CONTENT.APPROVED
    }, {$inc: {viewCount: 1}}, {new: true})
    .populate('creator', CONST.PUBLIC_CONSUMER_INFO)
    .populate({
      path: 'comments',
      model: 'Comment',
      limit: CONST.COMMENT_SHOWCASE_COUNT,
      options: {
        sort: {'_id': -1}
      },
      populate: {
        path: 'creator',
        model: 'Consumer',
        select: CONST.PUBLIC_CONSUMER_INFO_LIST
      }
    })
    .lean()
    .exec()
    .then((data: IPost) => {
      if (data) {
        res.status(200).json(data)        
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
   * Lists comments on item
   * 
   * @class PostRouter
   * @method comments
   * @param {Request} req 
   * @param {Response} res 
   * @returns {void}
   */
  public comments = (req: Request, res: Response): void => {
    let slug: string = req.params.slug,
      opt: any = UTIL.assembleSearchParams(req),
      match: any = {}
     
    if (req.query.hasOwnProperty('keywords') && req.query.keywords.length > 0) {
      let query: string[] = req.query.keywords.split(',')
      match = {content: {$in: query}}
    }

    Post
    .findOne({slug})
    .select(CONST.COMMENT_PARENT_FIELD_LIST)
    .populate('creator', CONST.PUBLIC_CONSUMER_INFO_LIST)
    .populate({
      path: 'comments',
      model: 'Comment',
      match,
      options: {
        sort: {'_id': -1},
        limit: opt.limit,
        skip: opt.skip
      },
      populate: {
        path: 'creator',
        model: 'Consumer',
        select: CONST.PUBLIC_CONSUMER_INFO_LIST
      }
    })
    .lean()
    .then((data: IPost) => {
      if (data) {
        res.status(200).json(data)        
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
   * Gets likes, dislikes, saves, shares and downloads of item
   * 
   * @class PostRouter
   * @method sublist
   * @param {Request} req 
   * @param {Response} res 
   * @returns {void}
   */
  public sublist = (req: Request, res: Response): void => {
    const slug: string = req.params.slug,
      path: string = req.params.sublist,
      opt: any = UTIL.assembleSearchParams(req)

    if (CONST.SUBLISTS.indexOf(path) > -1) {
      Post
      .findOne({slug})
      .select(CONST.LIKE_PARENT_FIELD_LIST)
      .populate('creator', CONST.PUBLIC_CONSUMER_INFO_LIST)
      .populate({
        path,
        model: UTIL.getModelNameFromPath(path),
        group: 'type',
        options: {
          sort: {'_id': -1},
          limit: opt.limit,
          skip: opt.skip
        },
        populate: {
          path: 'creator',
          model: 'Consumer',
          select: CONST.PUBLIC_CONSUMER_INFO_LIST
        }
      })
      .lean()
      .then((data: IPost) => {
        if (data) {
          res.status(200).json(data)        
        } else {
          res.status(404).send()
        }
      })
      .catch((err: Error) => {
        res.status(res.statusCode).send()
        console.log(err)
      })
    } else {
      res.status(404).send()
    }
  }
  
  /**
   * Check proposed slug is available to user
   *
   * @class ConsumerRouter
   * @method slug
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public slug = (req: Request, res: Response): void => {
    let slug: string = req.body.slug

    if (slug.length < 1) {
      res.status(422).json({ message: ERRORS.CONTENT.CONTENT_SLUG_REQUIRED })
    } else {
      Post
      .findOne({slug})
      .then((data: IPost) => {
        let isAvailable: boolean = !(data)
        res.status(200).json({isAvailable})
      })
      .catch((err: Error) => {
        res.status(res.statusCode).send()
        console.log(err)
      })
    }
  }

  /**
   * Creates single new entry
   *
   * @class PostRouter
   * @method create
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public create = (req: Request, res: Response): void => {
    const user: IUser = req.user,
      creator: Schema.Types.ObjectId = user._id,
      creatorRef: string = user.ref,
      title: string = req.body.title

    if (!creator || validator.isEmpty(creatorRef)) {
      res.status(422).json({ message: ERRORS.CONTENT.CONTENT_CREATOR_REQUIRED })
    } else if (!title || validator.isEmpty(title)) {
      res.status(422).json({ message: ERRORS.CONTENT.CONTENT_TITLE_REQUIRED })
    } else {
      const post = new Post(Object.assign({}, {
          creator,
          ref: creatorRef
        }, UTIL.sanitizeInput(CONST.ACTION_TARGETS.POST, req.body)))

      let log: any = {
        creator,
        creatorRef,
        targetRef: CONST.ACTION_TARGETS.POST,
        action: CONST.USER_ACTIONS.COMMON.CREATE,
        ua: req.body.ua || req.ua
      }

      post
      .save()
      .then((data: IPost) => {
        res.status(201).json(data)
        log.target = data._id

        return Consumer.findByIdAndUpdate(creator, {$inc: {postCount: 1}})
      })
      .then((user: IUser) => {
        new Logger(log)
      })
      .catch((err: Error) => {
        new Err(res, err, log)
      })
    }
  }
  
  /**
   * Updates entry by params of 'slug'
   *
   * @class PostRouter
   * @method update
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public update = (req: Request, res: Response): void => {
    const user: IUser = req.user,
      creator: Schema.Types.ObjectId = user._id,
      creatorRef: string = user.ref,
      slug: string = req.params.slug,
      title: string = req.body.title,
      body: any = UTIL.sanitizeInput(CONST.ACTION_TARGETS.POST, req.body)

    if (!creator || validator.isEmpty(creatorRef)) {
      res.status(422).json({ message: ERRORS.CONTENT.CONTENT_CREATOR_REQUIRED })
    } else if (title && validator.isEmpty(title)) {
      res.status(422).json({ message: ERRORS.CONTENT.CONTENT_TITLE_REQUIRED })
    } else if (slug && validator.isEmpty(slug)) {
      res.status(422).json({ message: ERRORS.CONTENT.CONTENT_SLUG_REQUIRED })
    } else {
      let log: any = {
        creator,
        creatorRef,
        targetRef: CONST.ACTION_TARGETS.POST,
        action: CONST.USER_ACTIONS.COMMON.UPDATE,
        ua: req.body.ua || req.ua
      }

      Post
      .findOneAndUpdate({creator, slug}, body, {new: true})
      .then((data: IPost) => {
        if (data) {
          res.status(200).json(data)
          log.target = data._id
          return data
        }

        res.status(404).send()
        return null
      })
      .then((data: IPost) => {
        new Logger(log)
      })
      .catch((err: Error) => {
        new Err(res, err, log)
      })
    }
  }
  /**
   * Deletes entry by params of 'slug'
   *
   * @class PostRouter
   * @method delete
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public delete = (req: Request, res: Response): void => {
    const user: IUser = req.user,
      creator: Schema.Types.ObjectId = user._id,
      slug: string = req.params.slug

    let log: any = {
        creator,
        creatorRef: user.ref,
        action: CONST.USER_ACTIONS.COMMON.DELETE,
        targetRef: CONST.ACTION_TARGETS.POST,
        ua: req.body.ua || req.ua
      }

    Post
    .findOneAndRemove({creator, slug})
    .then((data: IPost) => {
      if (data) {
        log.target = data._id
        res.status(204).end()
        return data
      }

      res.status(404).send()
      return null
    })
    .then((data: IPost) => {
      return Consumer.findByIdAndUpdate(creator, {$inc: {postCount: -1}})
    })
    .then((user: IUser) => {
      new Logger(log)
    })
    .catch((err: Error) => {
      new Err(res, err, log)
    })
  }

  routes() {
    this.router.get('/', this.list)
    this.router.get('/:slug', this.get)

    // comment route
    this.router.get('/:slug/comments', this.comments)
    
    // action list route
    this.router.get('/:slug/:sublist', this.sublist)
    
    // check slug
    this.router.post('/slug', this.slug)

    // create route
    this.router.post('/', passport.authenticate('consumerJwt', {
      session: false
    }), this.create)

    // update route
    this.router.patch('/:slug', passport.authenticate('consumerJwt', {
      session: false
    }), this.update)

    // delete route
    this.router.delete('/:slug', passport.authenticate('consumerJwt', {
      session: false
    }), this.delete)
  }
}

// export
const postRouter = new PostRouter()
postRouter.routes()
const thisRouter = postRouter.router

export default thisRouter
