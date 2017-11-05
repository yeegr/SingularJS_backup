import {
  NextFunction,
  Request,
  Response,
  Router
} from 'express'

import * as UTIL from '../../../common/util'
import * as CONST from '../../../common/values/constants.json'

import Post from '../models/PostModel'

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
    let query: object = {},
      page: number = (req.query.hasOwnProperty('page')) ? parseInt(req.query.page, 10) : 0,
      count: number = (req.query.hasOwnProperty('count')) ? parseInt(req.query.count, 10) : (<any>CONST).DEFAULT_PAGE_COUNT


    Post
    .find(query)
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(res.statusCode).json(err)
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
    .findOne({slug})
    .then((data) => {
      res.status(200).json({data})
    })
    .catch((err) => {
      res.status(500).json({err})
    })
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
    const title: string = req.body.title,
      slug: string = req.body.slug,
      content: string = req.body.content,
      hero: string = req.body.hero,
      category: string = req.body.category,
      tags: [string] = req.body.tags

    if (!title || !slug || !content) {
      res.status(422).json({ message: 'All Fields Required.' })
    } else {
      const post = new Post({
        title,
        slug,
        content,
        hero,
        category,
        tags
      })
  
      post
      .save()
      .then((data) => {
        res.status(201).json({data})
      })
      .catch((err) => {
        res.status(500).json({err})
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
    const slug: string = req.body.slug
    
    Post
    .findOneAndUpdate({slug}, req.body)
    .then((data) => {
      res.status(200).json({data});
    })
    .catch((err) => {
      res.status(500).json({err})
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
    const slug: string = req.body.slug
    
    Post.findOneAndRemove({slug})
    .then(() => {
      res.status(204).end()
    })
    .catch((err) => {
      res.status(500).json({err})
    })

  }

  routes() {
    this.router.get('/', this.list)
    this.router.get('/:slug', this.get)
    this.router.post('/', this.create)
    this.router.put('/:slug', this.update)
    this.router.delete('/:slug', this.delete)
  }
}

// export
const postRouter = new PostRouter()
postRouter.routes()
const thisRouter = postRouter.router

export default thisRouter
