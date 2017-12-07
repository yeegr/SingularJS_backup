import { NextFunction, Request, Response, Router } from 'express'
import { Schema, Types } from 'mongoose'

import * as validator from 'validator'
import * as passport from 'passport'
import '../config/passport/consumer'

import * as CONFIG from '../../../common/options/config'
import * as CONST from '../../../common/options/constants'
import * as ERR from '../../../common/options/errors'
import * as UTIL from '../../../common/util'
import Logger from '../modules/logger'
import Err from '../modules/err'

import Consumer from '../models/users/ConsumerModel'
import IConsumer from '../interfaces/users/IConsumer'

import IComment from '../interfaces/share/IComment'

import Event from '../models/event/EventModel'
import IEvent from '../interfaces/event/IEvent'

/**
 * EventRouter class
 *
 * @class EventRouter
 */
class EventRouter {
  router: Router

  /**
   * Constructor
   *
   * @class EventRouter
   * @constructor
   */
  constructor() {
    this.router = Router()
    this.routes()
  }

  /**
   * Intializes listing
   *
   * @class EventRouter
   * @method search
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public list = (req: Request, res: Response): void => {
    let handle: string = UTIL.getRequestParam(req, 'organizer')

    if (handle.length > 0) {
      Consumer
      .findOne({handle})
      .select('_id')
      .then((user: IConsumer) => {
        if (user) {
          this.search(req, res, user._id)
        } else {
          res.status(404).json({ message: ERR.USER.USER_NOT_FOUND })
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
   * @class EventRouter
   * @method list
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  private search = (req: Request, res: Response, creator?: Schema.Types.ObjectId) => {
    let params = UTIL.assembleSearchParams(req, {
        status: CONST.STATUSES.EVENT.APPROVED
      }, 'title excerpt content')

    if (creator) {
      params.query.creator = creator
    }

    Event
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
    .then((data: IEvent[]) => {
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
   * @class EventRouter
   * @method get
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public get = (req: Request, res: Response): void => {
    Event
    .findOneAndUpdate({
      slug: req.params.slug,
      status: CONST.STATUSES.EVENT.APPROVED
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
    .then((data: IEvent) => {
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
      res.status(422).json({ message: ERR.EVENT.EVENT_SLUG_REQUIRED })
    } else {
      Event
      .findOne({slug})
      .then((data: IEvent) => {
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
   * @class EventRouter
   * @method create
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public create = (req: Request, res: Response): void => {
    const user: IConsumer = req.user,
      creator: Schema.Types.ObjectId = user._id,
      creatorRef: string = user.ref,
      title: string = req.body.title,
      slug: string = req.body.slug

    if (!creator || validator.isEmpty(creatorRef)) {
      res.status(422).json({ message: ERR.EVENT.EVENT_AUTHOR_REQUIRED })
    } else if (!title || validator.isEmpty(title)) {
      res.status(422).json({ message: ERR.EVENT.EVENT_TITLE_REQUIRED })
    } else {
      const evt = new Event(Object.assign({}, {
        creator,
        ref: creatorRef
      }, UTIL.sanitizeInput(CONST.ACTION_TARGETS.EVENT, req.body)))

      let log = {
        creator,
        creatorRef,
        action: CONST.USER_ACTIONS.COMMON.CREATE,
        targetRef: CONST.ACTION_TARGETS.EVENT,
        slug,
        ua: req.body.ua || req.ua
      }

      evt
      .save()
      .then((data: IEvent) => {
        res.status(201).json(data)
        
        new Logger(Object.assign({}, log, {
          target: data._id
        }))
      })
      .catch((err: Error) => {
        new Err(res, err, log)
      })
    }
  }
  
  /**
   * Updates entry by params of 'slug'
   *
   * @class EventRouter
   * @method update
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public update = (req: Request, res: Response): void => {
    const user: IConsumer = req.user,
      creator: Schema.Types.ObjectId = user._id,
      creatorRef: string = user.ref,
      slug: string = req.params.slug,
      title: string = req.body.title,
      body: any = UTIL.sanitizeInput(CONST.ACTION_TARGETS.EVENT, req.body)

    if (!creator || validator.isEmpty(creatorRef)) {
      res.status(422).json({ message: ERR.EVENT.EVENT_AUTHOR_REQUIRED })
    } else if (title && validator.isEmpty(title)) {
      res.status(422).json({ message: ERR.EVENT.EVENT_TITLE_REQUIRED })
    } else {
      let log = {
        creator: user._id,
        creatorRef: CONST.USER_TYPES.CONSUMER,
        action: CONST.USER_ACTIONS.COMMON.UPDATE,
        targetRef: CONST.ACTION_TARGETS.EVENT,
        slug,
        ua: req.body.ua || req.ua
      }

      Event
      .findOneAndUpdate({creator, slug}, body, {new: true})
      .then((data: IEvent) => {
        if (data) {
          res.status(200).json(data)
          
          new Logger(Object.assign({}, log, {
            target: data._id
          }))
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
   * Submit entry by params of 'slug'
   *
   * @class EventRouter
   * @method submit
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public submit = (req: Request, res: Response): void => {
    const user: IConsumer = req.user,
      creator: Schema.Types.ObjectId = user._id,
      slug: string = req.params.slug

    Event
    .findOne({creator, slug})
    .then((data: IEvent) => {
      if (!data) {
        res.status(404).send({ message: ERR.EVENT.CANNOT_SUBMIT_EVENT })
      } else {
        if (data.status === CONST.STATUSES.EVENT.PENDING || data.status === CONST.STATUSES.EVENT.APPROVED) {
          res.status(422).json({ message: ERR.EVENT.EVENT_ALREADY_SUMMITED })
        } else if (validator.isEmpty(data.slug)) {
          res.status(422).json({ message: ERR.EVENT.EVENT_TITLE_REQUIRED })
        } else if (validator.isEmpty(data.slug)) {
          res.status(422).json({ message: ERR.EVENT.EVENT_SLUG_REQUIRED })
        } else if (validator.isEmpty(data.content)) {
          res.status(422).json({ message: ERR.EVENT.EVENT_CONTENT_REQUIRED })
        } else {
          let log = {
            creator,
            creatorRef: user.ref,
            action: CONST.USER_ACTIONS.CONSUMER.SUBMIT,
            targetRef: CONST.ACTION_TARGETS.EVENT,
            slug,
            ua: req.body.ua || req.ua
          }

          // isPublic ? pending : approved
          data.status = data.isPublic ? CONST.STATUSES.EVENT.PENDING : CONST.STATUSES.EVENT.APPROVED

          data
          .save()
          .then((evt: IEvent) => {
            res.status(200).json(evt)
                        
            new Logger(Object.assign({}, log, {
              target: evt._id
            }))
          })
          .catch((err: Error) => {
            new Err(res, err, log)
          })
        }
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
   * @class EventRouter
   * @method retract
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public retract = (req: Request, res: Response): void => {
    const user: IConsumer = req.user,
      creator: Schema.Types.ObjectId = user._id,
      slug: string = req.params.slug

    Event
    .findOne({creator, slug})
    .then((data: IEvent) => {
      if (data.status === CONST.STATUSES.EVENT.EDITING) {
        res.status(422).json({ message: ERR.EVENT.EVENT_CANNOT_BE_RETRACTED })
      } else {
        let log = {
          creator,
          creatorRef: user.ref,
          action: CONST.USER_ACTIONS.CONSUMER.RETRACT,
          targetRef: CONST.ACTION_TARGETS.POST,
          slug,
          ua: req.body.ua || req.ua          
        }

        // approval ? pending : approved
        data.status = CONST.STATUSES.EVENT.EDITING

        data
        .save()
        .then((evt: IEvent) => {
          res.status(200).json(evt)
                    
          new Logger(Object.assign({}, log, {
            target: evt._id
          }))
        })
        .catch((err: Error) => {
          new Err(res, err, log)
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
   * @class EventRouter
   * @method delete
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public delete = (req: Request, res: Response): void => {
    const user: IConsumer = req.user,
      creator: Schema.Types.ObjectId = user._id,
      slug: string = req.params.slug,
      log = {
        creator: user._id,
        creatorRef: CONST.USER_TYPES.CONSUMER,
        action: CONST.USER_ACTIONS.COMMON.DELETE,
        targetRef: CONST.ACTION_TARGETS.POST,
        slug,
        ua: req.body.ua || req.ua
      }

    Event
    .findOneAndRemove({creator, slug})
    .then((data: IEvent) => {
      if (data) {
        res.status(204).end()
        
        new Logger(Object.assign({}, log, {
          target: data._id
        }))
      } else {
        res.status(404).send()
      }
    })
    .catch((err: Error) => {
      new Err(res, err, log)
    })
  }

  /**
   * Lists comments on item
   * 
   * @class EventRouter
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

    Event
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
    .then((data: IEvent) => {
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
   * @class EventRouter
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
      Event
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
      .then((data: IEvent) => {
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

  routes() {
    this.router.get('/', this.list)
    this.router.get('/:slug', this.get)

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

    // submit route
    this.router.post('/:slug/submit', passport.authenticate('consumerJwt', {
      session: false
    }), this.submit)

    // retract route
    this.router.post('/:slug/retract', passport.authenticate('consumerJwt', {
      session: false
    }), this.retract)

    // delete route
    this.router.delete('/:slug', passport.authenticate('consumerJwt', {
      session: false
    }), this.delete)

    // comment route
    this.router.get('/:slug/comments', this.comments)

    // action list route
    this.router.get('/:slug/:sublist', this.sublist)
  }
}

// export
const eventRouter = new EventRouter()
eventRouter.routes()
const thisRouter = eventRouter.router

export default thisRouter
