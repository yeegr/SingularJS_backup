import { NextFunction, Request, RequestHandler, Response, Router } from 'express'
import { Schema, Model } from 'mongoose'
import * as validator from 'validator'

import { CONFIG, CONST, ERRORS, UTIL } from '../../../common'
import { Logger, Err } from '../modules'

import IUser from '../interfaces/users/IUser'
import IContent from '../interfaces/share/IContent'

/**
 * Initializes listing 
 * 
 * @func list
 * @param {Request} req 
 * @param {Response} res
 * @returns {void} 
 */
export function list(req: Request, res: Response): void {
  let handle: string = UTIL.getRequestParam(req, req.routeVar.userHandleKey)

  if (handle && handle.length > 0) {
    const UserModel: Model<IUser> = UTIL.getModelFromName(req.routeVar.creatorType)

    UserModel
    .findOne({handle})
    .select('_id')
    .lean()
    .then((user: IUser) => {
      if (user) {
        search(req, res, user._id)
      } else {
        res.status(404).json({ message: ERRORS.USER.USER_NOT_FOUND })
      }
    })
    .catch((err: Error) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
  } else {
    search(req, res)
  }
}

/**
 * Returns listing results
 *
 * @func search
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
const search = (req: Request, res: Response, creator?: Schema.Types.ObjectId) => {
  let params = UTIL.assembleSearchParams(req, {
      status: CONST.STATUSES.CONTENT.APPROVED
    }, req.routeVar.keywordFields)

  if (creator) {
    params.query.creator = creator
  }

  const DataModel: Model<IContent> = UTIL.getModelFromName(req.routeVar.contentType)

  DataModel
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
  .then((data: IContent[]) => {
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
 * @func get
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
export function get(req: Request, res: Response): void {
  const DataModel: Model<IContent> = UTIL.getModelFromName(req.routeVar.contentType)

  DataModel
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
  .then((data: IContent) => {
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
 * @func comments
 * @param {Request} req 
 * @param {Response} res 
 * @returns {void}
 */
export function comments(req: Request, res: Response): void {
  let slug: string = req.params.slug,
    opt: any = UTIL.assembleSearchParams(req),
    match: any = {}
    
  if (req.query.hasOwnProperty('keywords') && req.query.keywords.length > 0) {
    let query: string[] = req.query.keywords.split(',')
    match = {content: {$in: query}}
  }

  const DataModel: Model<IContent> = UTIL.getModelFromName(req.routeVar.contentType)

  DataModel
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
  .then((data: IContent) => {
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
 * @func sublist
 * @param {Request} req 
 * @param {Response} res 
 * @returns {void}
 */
export function sublist(req: Request, res: Response): void {
  const slug: string = req.params.slug,
    path: string = req.params.sublist,
    opt: any = UTIL.assembleSearchParams(req)

  if (CONST.SUBLISTS.indexOf(path) > -1) {
    const DataModel: Model<IContent> = UTIL.getModelFromName(req.routeVar.contentType)

    DataModel
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
    .then((data: IContent) => {
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
 * @func slug
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
export function slug(req: Request, res: Response): void {
  let slug: string = req.body.slug

  if (slug.length < 1) {
    res.status(422).json({ message: ERRORS.CONTENT.CONTENT_SLUG_REQUIRED })
  } else {
    const DataModel = UTIL.getModelFromName(req.routeVar.contentType)

    DataModel
    .findOne({slug})
    .then((data: IContent) => {
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
 * @func create
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
export function create(req: Request, res: Response): void {
  const [creator, creatorRef] = UTIL.getLoginedUser(req),
    title: string = req.body.title,
    slug: string = req.body.slug

  // verify logined user
  if (!creator || validator.isEmpty(creatorRef)) {
    res.status(422).json({ message: ERRORS.CONTENT.CONTENT_CREATOR_REQUIRED })
  // check if content has title
  } else if (!title || validator.isEmpty(title)) {
    res.status(422).json({ message: ERRORS.CONTENT.CONTENT_TITLE_REQUIRED })
  } else {
    const [UserModel, DataModel] = UTIL.getModels(req)

    const data: IContent = new DataModel(Object.assign({}, {
        creator,
        ref: creatorRef
      }, UTIL.sanitizeInput(req.routeVar.contentType, req.body)))

    let log: any = {
      creator,
      creatorRef,
      targetRef: req.routeVar.contentType,
      action: CONST.USER_ACTIONS.COMMON.CREATE,
      ua: req.body.ua || req.ua
    }

    data
    .save()
    .then((content: IContent) => {
      res.status(201).json(content)
      log.target = content._id

      return UserModel.findByIdAndUpdate(creator, UTIL.getIncrement(req, 1))
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
 * @func update
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
export function update(req: Request, res: Response): void {
  const [creator, creatorRef] = UTIL.getLoginedUser(req),
    slug: string = req.params.slug,
    title: string = req.body.title,
    body: any = UTIL.sanitizeInput(req.routeVar.contentType, req.body)

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
      targetRef: req.routeVar.contentType,
      action: CONST.USER_ACTIONS.COMMON.UPDATE,
      ua: req.body.ua || req.ua
    }

    const DataModel = UTIL.getModelFromName(req.routeVar.contentType)

    DataModel
    .findOneAndUpdate({creator, slug}, body, {new: true})
    .then((data: IContent) => {
      if (data) {
        res.status(200).json(data)
        log.target = data._id
        return data
      }

      res.status(404).send()
      return null
    })
    .then((data: IContent) => {
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
 * @func remove
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
export function remove(req: Request, res: Response): void {
  const [creator, creatorRef] = UTIL.getLoginedUser(req),
    slug: string = req.params.slug,
    [UserModel, DataModel] = UTIL.getModels(req)

  let log: any = {
    creator,
    creatorRef,
    action: CONST.USER_ACTIONS.COMMON.DELETE,
    targetRef: req.routeVar.contentType,
    ua: req.body.ua || req.ua
  }

  DataModel
  .findOneAndRemove({creator, slug})
  .then((data: IContent) => {
    if (data) {
      log.target = data._idtotalFollowings
      res.status(204).end()
      return data
    }

    res.status(404).send()
    return null
  })
  .then((data: IContent) => {
    return UserModel.findOneAndUpdate({
      _id: creator,
      [req.routeVar.contentCounter]: {$gt: 0}
    }, UTIL.getIncrement(req, -1))
  })
  .then((user: IUser) => {
    new Logger(log)
  })
  .catch((err: Error) => {
    new Err(res, err, log)
  })
}

/**
 * Creates standard routes for entry
 * 
 * @func createRoutes
 * @param {Router} router
 * @param {RequestHandler} auth
 * @param {RequestHandler} setRouteVar
 * @return {void}
 */
export function createRoutes(router: Router, auth: RequestHandler, setRouteVar: RequestHandler): void {
  // list route
  router.get('/', setRouteVar, list)

  // single entry route
  router.get('/:slug', setRouteVar, get)

  // comment route
  router.get('/:slug/comments', setRouteVar, comments)
  
  // action list route
  router.get('/:slug/:sublist', setRouteVar, sublist)
  
  // check if slug available
  router.post('/slug', setRouteVar, slug)

  // create route
  router.post('/', auth, setRouteVar, create)

  // update route
  router.patch('/:slug', auth, setRouteVar, update)

  // delete route
  router.delete('/:slug', auth, setRouteVar, remove)  
}