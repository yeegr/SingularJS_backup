import {
  NextFunction,
  Request,
  Response,
  Router
} from 'express'

import { Schema, Types } from 'mongoose'

import * as passport from 'passport'
import '../config/passport'

import * as CONST from '../../../common/options/constants'
import * as UTIL from '../../../common/util'
import Logger from './_Logger'

import Consumer from '../models/ConsumerModel'
import IConsumer from '../interfaces/IConsumer'

import Post from '../models/PostModel'
import IPost from '../interfaces/IPost'

import CommentRouter from './CommentRouter'
import IRequest from '../interfaces/IRequest'

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
   * List search results
   *
   * @class PostRouter
   * @method list
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public list(req: Request, res: Response): void {
    let query: any = {},
      page: number = UTIL.getListPageIndex(req),
      count: number = UTIL.getListCountPerPage(req),
      sort: any = UTIL.getListSort(req)

    if (UTIL.isNotUndefinedNullEmpty(UTIL.getRequestParam(req, 'in'))) {
      query = Object.assign({}, query, UTIL.getListArray(req, 'in'))
    }

    Post
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
   * @class PostRouter
   * @method get
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public get(req: Request, res: Response): void {
    const slug: string = req.params.slug
    
    Post
    .findOneAndUpdate({slug}, {$inc: {totalViews: 1}}, {new: true})
    .populate('creator', CONST.PUBLIC_CONSUMER_INFO)
    .then((post: IPost) => {
      if (post) {
        res.status(200).json({post})        
      } else {
        res.status(404).send()
      }
    })
    .catch((err) => {
      res.status(res.statusCode).json({err})
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
      .then((data) => {
        let isAvailable: boolean = !(data)
        res.status(200).json({isAvailable})
      })
      .catch((err) => {
        res.status(res.statusCode).json({err})
      })
    } else {
      res.status(200).json({ message: 'POST_SLUG_REQUIRED' })
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
  public create(req: Request, res: Response): void {
    const creator: string = req.user._id,
      title: string = req.body.title,
      slug: string = req.body.slug,
      content: string = req.body.content,
      hero: string = req.body.hero,
      category: string = req.body.category,
      tags: [string] = req.body.tags,
      device: any = req.body.device

    if (!title) {
      res.status(422).json({ message: 'POST_TITLE_REQUIRED' })
    } else if (!slug) {
      res.status(422).json({ message: 'POST_SLUG_REQUIRED' })
    } else if (!content) {
      res.status(422).json({ message: 'POST_CONTENT_REQUIRED' })
    } else {
      const post = new Post({
        creator,
        title,
        slug,
        content,
        hero,
        category,
        tags
      })

      post
      .save()
      .then((data: IPost) => {
        res.status(201).json({data})
        
        new Logger({
          creator,
          type: 'CONSUMER',
          action: 'UPDATE',
          target: 'POST',
          ref: data._id,
          device
        })
      })
      .catch((err) => {
        res.status(res.statusCode).json({err})
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
  public update(req: Request, res: Response): void {
    const user: IConsumer = req.user,
      creator: Schema.Types.ObjectId = user._id,
      slug: string = req.params.slug,
      device: any = req.body.device
    
    Post
    .findOneAndUpdate({creator, slug}, req.body, {new: true})
    .then((data: IPost) => {
      if (data) {
        res.status(200).json({data})
        
        new Logger({
          creator: user._id,
          type: 'CONSUMER',
          action: 'UPDATE',
          target: 'POST',
          ref: data._id,
          device
        })
      } else {
        res.status(404).send()
      }
    })
    .catch((err) => {
      res.status(res.statusCode).json({err})
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
  public delete(req: Request, res: Response): void {
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
          type: 'CONSUMER',
          action: 'DELETE',
          target: 'POST',
          ref: data._id,
          device
        })        
      } else {
        res.status(404).send()
      }
    })
    .catch((err) => {
      res.status(res.statusCode).json({err})
    })
  }

  /**
   * Attaches current entry to request
   * 
   * @param {IRequest} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  public attach(req: IRequest, res: Response, next: NextFunction): void {
    const slug: string = req.params.slug
    
    Post
    .findOne({slug})
    .populate('creator', CONST.PUBLIC_CONSUMER_INFO)
    .then((post: IPost) => {
      req.ref = {
        type: 'POST',
        data: post
      }

      next()
    })
    .catch((err) => {
      console.log(err)
    })
  }

  /**
   * Detaches uri from request
   * 
   * @param {IRequest} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  public detach(req: IRequest, res: Response, next: NextFunction): void {
    delete req.ref
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

    // delete route
    this.router.delete('/:slug', passport.authenticate('jwt', {
      session: false
    }), this.delete)

    // comment route
    this.router.use('/:slug/comments', this.attach, CommentRouter)
  }
}

// export
const postRouter = new PostRouter()
postRouter.routes()
const thisRouter = postRouter.router

export default thisRouter
