import {
  Document,
  Schema
} from 'mongoose'

import {
  Request
} from 'express'

import * as CONST from '../../../common/options/constants'

import IConsumer from '../interfaces/IConsumer'
import Consumer from '../models/ConsumerModel'

import Post from '../models/PostModel'
import Event from '../models/EventModel'

/**
 * Returns a data model object by its name
 * 
 * @param {string} key 
 */
export function selectDataModel(key: string): any {
  let modelName = key.toLowerCase(),
    dataModel = null

  switch (modelName) {
    case 'consumer':
      dataModel = Consumer
    break

    case 'post':
      dataModel = Post
    break

    case 'event':
      dataModel = Event
    break
  }

  return dataModel
}

/**
 * Gets document store key from action
 * 
 * @param {string} action
 * @returns {string}
 */
export function getKeyFromAction(action: string): string {
  let key: string = null

  switch (action) {
    case CONST.USER_ACTIONS.CONSUMER.LIKE:
    case CONST.USER_ACTIONS.CONSUMER.UNDO_LIKE:
      key = 'likes'
    break

    case CONST.USER_ACTIONS.CONSUMER.DISLIKE:
    case CONST.USER_ACTIONS.CONSUMER.UNDO_DISLIKE:
      key = 'dislikes'
    break

    case CONST.USER_ACTIONS.CONSUMER.SAVE:
    case CONST.USER_ACTIONS.CONSUMER.UNDO_SAVE:
      key = 'saves'
    break

    case CONST.USER_ACTIONS.CONSUMER.SHARE:
      key = 'shares'
    break

    case CONST.USER_ACTIONS.CONSUMER.DOWNLOAD:
      key = 'downloads'
    break

    case CONST.USER_ACTIONS.CONSUMER.FOLLOW:
    case CONST.USER_ACTIONS.CONSUMER.UNFOLLOW:
      key = 'followings'
    break
  }

  return key
}

/**
 * Adds a ObjectId to list
 * 
 * @param {any} doc 
 * @param {string} key 
 * @param {Schema.Types.ObjectId} id 
 * @param {Function} [callback]
 * @returns {void} 
 */
export function addToList(doc: any, key: string, id: Schema.Types.ObjectId, callback?: Function): void {
  let arr = doc[key]

  if (arr && arr.indexOf(id) < 0) {
    arr.push(id.toString())

    doc
    .save()
    .then((data: any) => {
      if (key === 'followings') {
        Consumer
        .findById(id)
        .then((user: IConsumer) => {
          user.addToList('followers', doc._id, callback)
        })
      } else if (callback) {
        callback(true)        
      }
    })
    .catch((err: Error) => {
      console.log(err)
    })
  } else if (callback) {
    callback()
  }
}

/**
 * Removes a ObjectId from list
 * 
 * @param {any} doc 
 * @param {string} key 
 * @param {Schema.Types.ObjectId} id 
 * @param {Function} [callback]
 * @returns {void} 
 */
export function removeFromList(doc: any, key: string, id: Schema.Types.ObjectId, callback?: Function): void {
  let arr = doc[key]

  if (arr && arr.indexOf(id) > -1) {
    arr.splice(arr.indexOf(id), 1)

    doc
    .save()
    .then((data: any) => {
      if (key === 'followings') {
        Consumer
        .findById(id)
        .then((user: IConsumer) => {
          user.removeFromList('followers', doc._id, callback)
        })
      } else if (callback) {
        callback(true)        
      }
    })
    .catch((err: Error) => {
      console.log(err)
    })
  } else if (callback) {
    callback()
  }
}

/**
 * Adds a comment to the document comment list
 * 
 * @export
 * @param {any} doc 
 * @param {Schema.Types.ObjectId} id 
 * @param {number} rating 
 * @returns {void} 
 */
export function addComment(doc: any, id: Schema.Types.ObjectId, rating: number): void {
  let arr = doc.comments

  if (arr && arr.indexOf(id) < 0) {
    arr.push(id)
    doc.totalRating += rating
    doc.save()
  }
}

/**
 * Removes a comment to the document comment list
 * 
 * @export
 * @param {any} doc 
 * @param {Schema.Types.ObjectId} id 
 * @param {number} rating 
 * @returns {void} 
 */
export function removeComment(doc: any, id: Schema.Types.ObjectId, rating: number): void {
  let arr = doc.comments

  if (arr && arr.indexOf(id) > -1) {
    arr.splice(arr.indexOf(id), 1)
    doc.totalRating -= rating
    doc.save()
  }
}

/**
 * Adds 1 (or -1) to document counter
 * 
 * @param {any} doc 
 * @param {string} key 
 * @param {Function} [callback] 
 * @param {number} [step = 1]
 */
export function addCount(doc: any, key: string, callback?: Function, step: number = 1) {
  doc[key] += step

  doc
  .save()
  .then((data: any) => {
    if (callback) {
      callback(true)
    }
  })
  .catch((err: Error) => {
    console.log(err)
  })
}

/*******************************
 * Generic functions to retrieve 
 * values from HTTP request
 *******************************/

/**
 * Gets value by key
 * 
 * @param {Request} req 
 * @param {string} key 
 * @param {boolean} [isInteger = false] 
 * @param {boolean} [isNumber = false] 
 * @returns {string}
 */
export function getRequestParam(req: Request, key: string): string {
  let body = req.body,
    params = req.params,
    query = req.query,
    value = null

  value = (body && body.hasOwnProperty(key)) ? query[key] : value
  value = (params && params.hasOwnProperty(key)) ? params[key] : value
  value = (query && query.hasOwnProperty(key)) ? query[key] : value

  return value
}

/**
 * Gets query page index
 * 
 * @param {Request} req
 * @returns {number} 
 */
export function getListPageIndex(req: Request): number {
  return parseInt(getRequestParam(req, 'page'), 10) || 0
}

/**
 * Gets query item count per page
 * 
 * @param {Request} req 
 * @returns {number}
 */
export function getListCountPerPage(req: Request): number {
  return parseInt(getRequestParam(req, 'count'), 10) || CONST.DEFAULT_PAGE_COUNT
}

/**
 * Gets query sort key
 * 
 * @param {Request} req 
 * @param {string} [key = 'sortOn']
 * @returns {any} 
 */
export function getListSort(req: Request, key: string = 'sortOn'): any {
  let sort: any = {},
    prop = getRequestParam(req, key)

  if (prop && prop.length > 0) {
    sort[prop] = this.getListSortOrder(req)
  } else {
    // descending order by object id
    sort = {_id: -1}
  }

  return sort
}

/**
 * Gets query sort order
 * 
 * @param {Request} req 
 * @param {string} [key = 'orderBy'] 
 * @returns {number}
 */
export function getListSortOrder(req: Request, key: string = 'orderBy'): number {
  let order = getRequestParam(req, key),
    value = 1

  if (order && order.length > 0) {
    switch (order) {
      case '1':
      case 'asc':
      case 'asending':
        value = 1
      break

      case '-1':
      case 'desc':
      case 'desending':
        value = -1
      break
    }
  }

  return value
}

/**
 * Gets query by item list
 * 
 * @param {Request} req 
 * @param {string} field 
 * @returns {any}
 */
export function getListArray(req: Request, field: string): any {
  let query: any = {},
    key: string = this.getPropKey(field),
    list: string = this.getRequestParam(req, key).replace(/\, /g, ',')

  if (list && list.length > 0) {
    query[key] = {}
    query[key].$in = list.split(',')
  }

  return query
}

/**
 * Gets query key of item list
 * 
 * @param {string} input
 * @returns {string} 
 */
export function getPropKey(input: string): string {
  let output: string = input

  switch (input) {
    case 'in':
      output = '_id'
    break

    case 'slugs':
      output = 'slug'
    break
  }

  return output
}

/**
 * Gets query keywords
 * 
 * @param {Request} req 
 * @param {string} fields
 * @returns {any} 
 */
export function getListKeywordQuery(req: Request, fields: string): any {
  let query: any = {},
    keywords = this.getRequestParam(req, 'keywords')

  if (keywords && keywords.length > 0) {
    let rx = this.assembleKeywordRx(keywords),
      arr: string[] = fields.trim().split(',')

    query.$or = []
    
    arr.forEach(key => {
      let tmp: any = {}
      tmp[key.trim()] = rx
      query.$or.push(tmp)
    })
  }

  return query
}

/**
 * Assembles query keyword regexp
 * 
 * @param {string} str 
 * @param {string} [type = 'AND']
 * @returns {RegExp}
 */
export function assembleKeywordRx(str: string, type: string = 'AND'): RegExp {
  if (type === 'OR') {
    return new RegExp(str.trim().replace(/\s/g, '|').replace(/\,/g, '|'))
  } else {
    let arr = str.trim().replace(/\s/g, ',').split(','),
      rx = '^'

    arr.forEach((val: string) => {
      val = decodeURIComponent(val.trim())
      rx += '(?=.*' + val + ')'
      // rx += '(?=.*\\b' + val + '\\b)' // whole word only
    })

    rx += '.*$'

    return new RegExp(rx)    
  }
}


/**
 * Returns the timestamp from MongoDB ObjectId
 * 
 * @param {string} id
 * @param {boolean} [isUnix=true] 
 * @return {number} 
 */
export function getTimeFromObjectId(id: string, isUnix: boolean = true): number {
  return parseInt(id.substring(0, 8), 16) * (isUnix ? 1 : 1000)
}

/**
 * Set updated timestamp
 * 
 * @export
 * @param {Document} doc 
 * @param {[string]} keys 
 */
export function setUpdateTime(doc: Document, keys: [string]): void {
  let toUpdate = false

  keys.map((key) => {
    toUpdate = (doc.isModified(key)) ? true : toUpdate
  })

  if (toUpdate) {
    (<any>doc).updated = this.getTimestamp()
  }
}
