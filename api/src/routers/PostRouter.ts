import { NextFunction, Request, Response, Router } from 'express'
import { Schema, Types } from 'mongoose'

import * as validator from 'validator'
import * as passport from 'passport'
import '../config/passport'

import * as CONFIG from '../../../common/options/config'
import * as CONST from '../../../common/options/constants'
import * as ERR from '../../../common/options/errors'
import * as UTIL from '../../../common/util'
import Logger from '../modules/logger'
import IRequest from '../interfaces/IRequest'

import Consumer from '../models/ConsumerModel'
import IConsumer from '../interfaces/IConsumer'

import Post from '../models/PostModel'
import IPost from '../interfaces/IPost'
import IComment from '../interfaces/IComment';

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
      .then((user: IConsumer) => {
        if (user) {
          this.search(req, res, user._id)
        } else {
          res.status(404).json({ message: ERR.USER.USER_NOF_FOUND })
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
        status: CONST.STATUSES.POST.APPROVED
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
    .catch((err) => {
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
      status: CONST.STATUSES.POST.APPROVED
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
    .then((data: IPost) => {
      if (data) {
        res.status(200).json(data)        
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

    if (slug.length > 0) {
      Post
      .findOne({slug})
      .then((data: IPost) => {
        let isAvailable: boolean = !(data)
        res.status(200).json({isAvailable})
      })
      .catch((err) => {
        res.status(res.statusCode).send()
        console.log(err)
      })
    } else {
      res.status(422).json({ message: ERR.POST.POST_SLUG_REQUIRED })
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
    const user: IConsumer = req.user,
      creator: Schema.Types.ObjectId = user._id,
      ref: string = user.ref,
      title: string = req.body.title,
      slug: string = req.body.slug,
      device: any = req.body.device

    if (!creator || validator.isEmpty(ref)) {
      res.status(422).json({ message: ERR.POST.POST_AUTHOR_REQUIRED })
    } else if (!title || validator.isEmpty(title)) {
      res.status(422).json({ message: ERR.POST.POST_TITLE_REQUIRED })
    } else {
      const post = new Post(Object.assign({}, {
        creator
      }, UTIL.sanitizeInput(CONST.ACTION_TARGETS.POST, req.body)))

      post
      .save()
      .then((data: IPost) => {
        res.status(201).json(data)
        
        new Logger({
          creator,
          ref,
          action: CONST.USER_ACTIONS.CONSUMER.CREATE,
          type: CONST.ACTION_TARGETS.POST,
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
   * Updates entry by params of 'slug'
   *
   * @class PostRouter
   * @method update
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public update = (req: Request, res: Response): void => {
    const user: IConsumer = req.user,
      creator: Schema.Types.ObjectId = user._id,
      ref: string = user.ref,
      slug: string = req.params.slug,
      title: string = req.body.title,
      device: any = req.body.device,
      body: any = UTIL.sanitizeInput(CONST.ACTION_TARGETS.POST, req.body)

    if (!creator || validator.isEmpty(ref)) {
      res.status(422).json({ message: ERR.POST.POST_AUTHOR_REQUIRED })
    } else if (title && validator.isEmpty(title)) {
      res.status(422).json({ message: ERR.POST.POST_TITLE_REQUIRED })
    } else {
      Post
      .findOneAndUpdate({creator, slug}, body, {new: true})
      .then((data: IPost) => {
        if (data) {
          res.status(200).json(data)
          
          new Logger({
            creator: user._id,
            ref: CONST.USER_TYPES.CONSUMER,
            action: CONST.USER_ACTIONS.CONSUMER.UPDATE,
            type: CONST.ACTION_TARGETS.POST,
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
  }
  
  /**
   * Submit entry by params of 'slug'
   *
   * @class PostRouter
   * @method submit
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public submit = (req: Request, res: Response): void => {
    const user: IConsumer = req.user,
      creator: Schema.Types.ObjectId = user._id,
      ref: string = user.ref,
      slug: string = req.params.slug,
      device: any = req.body.device

    Post
    .findOne({creator, slug})
    .then((data: IPost) => {
      if (data.status === CONST.STATUSES.POST.PENDING || data.status === CONST.STATUSES.POST.APPROVED) {
        res.status(422).json({ message: ERR.POST.POST_ALREADY_SUMMITED })
      } else if (validator.isEmpty(data.slug)) {
        res.status(422).json({ message: ERR.POST.POST_TITLE_REQUIRED })
      } else if (validator.isEmpty(data.slug)) {
        res.status(422).json({ message: ERR.POST.POST_SLUG_REQUIRED })
      } else if (validator.isEmpty(data.content)) {
        res.status(422).json({ message: ERR.POST.POST_CONTENT_REQUIRED })
      } else {
        // approval ? pending : approved
        data.status = CONFIG.POST_REQURIES_APPROVAL ? CONST.STATUSES.POST.PENDING : CONST.STATUSES.POST.APPROVED

        data
        .save()
        .then((post: IPost) => {
          res.status(200).json(post)
          
          new Logger({
            creator,
            ref,
            action: CONST.USER_ACTIONS.CONSUMER.SUBMIT,
            type: CONST.ACTION_TARGETS.POST,
            target: post._id,
            device
          })
        })
        .catch((err: Error) => {
          res.status(res.statusCode).send()
          console.log(err)
        })
      }
    })
    .catch((err: Error) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
  }
  
  /**
   * Retract entry by params of 'slug'
   *
   * @class PostRouter
   * @method retract
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public retract = (req: Request, res: Response): void => {
    const user: IConsumer = req.user,
      creator: Schema.Types.ObjectId = user._id,
      ref: string = user.ref,
      slug: string = req.params.slug,
      device: any = req.body.device

    Post
    .findOne({creator, slug})
    .then((data: IPost) => {
      if (data.status === CONST.STATUSES.POST.EDITING) {
        res.status(422).json({ message: ERR.POST.POST_CANNOT_BE_RETRACTED })
      } else {
        // approval ? pending : approved
        data.status = CONST.STATUSES.POST.EDITING

        data
        .save()
        .then((post: IPost) => {
          res.status(200).json(post)
          
          new Logger({
            creator,
            ref,
            action: CONST.USER_ACTIONS.CONSUMER.RETRACT,
            type: CONST.ACTION_TARGETS.POST,
            target: post._id,
            device
          })
        })
        .catch((err: Error) => {
          res.status(res.statusCode).send()
          console.log(err)
        })
      }
    })
    .catch((err: Error) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
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
    const user: IConsumer = req.user,
      creator: Schema.Types.ObjectId = user._id,
      slug: string = req.params.slug,
      device: any = req.body.device

    Post
    .findOneAndRemove({creator, slug})
    .then((data: IPost) => {
      if (data) {
        res.status(204).end()
        
        new Logger({
          creator: user._id,
          ref: CONST.USER_TYPES.CONSUMER,
          action: CONST.USER_ACTIONS.CONSUMER.DELETE,
          type: CONST.ACTION_TARGETS.POST,
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

  /**
   * Gets comments on item
   * 
   * @class PostRouter
   * @method comments
   * @param {IRequest} req 
   * @param {Response} res 
   * @returns {void}
   */
  public comments = (req: IRequest, res: Response): void => {
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
    .catch((err) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
  }

  /**
   * Gets likes, dislikes, saves, shares and downloads of item
   * 
   * @class PostRouter
   * @method sublist
   * @param {IRequest} req 
   * @param {Response} res 
   * @returns {void}
   */
  public sublist = (req: IRequest, res: Response): void => {
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
        model: UTIL.getModelFromPath(path),
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
      .catch((err) => {
        res.status(res.statusCode).send()
        console.log(err)
      })
    } else {
      res.status(404).json()
    }
  }

  routes() {
    this.router.get('/', this.list)
    this.router.get('/:slug', this.get)

    // check slug
    this.router.post('/slug', this.slug)

    // create route
    this.router.post('/', passport.authenticate('jwt', {
      session: false
    }), this.create)

    // update route
    this.router.patch('/:slug', passport.authenticate('jwt', {
      session: false
    }), this.update)

    // submit route
    this.router.post('/:slug/submit', passport.authenticate('jwt', {
      session: false
    }), this.submit)

    // retract route
    this.router.post('/:slug/retract', passport.authenticate('jwt', {
      session: false
    }), this.retract)

    // delete route
    this.router.delete('/:slug', passport.authenticate('jwt', {
      session: false
    }), this.delete)

    // comment route
    this.router.get('/:slug/comments', this.comments)

    // action list route
    this.router.get('/:slug/:sublist', this.sublist)
  }
}

// export
const postRouter = new PostRouter()
postRouter.routes()
const thisRouter = postRouter.router

export default thisRouter
