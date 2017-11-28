import {
  Document,
  Schema,
  NativeError
} from 'mongoose'

import {
  Request
} from 'express'

import * as CONST from '../../../common/options/constants'

import IConsumer from '../interfaces/IConsumer'
import Consumer from '../models/ConsumerModel'

import Post from '../models/PostModel'
import Event from '../models/EventModel'

export function formatError(err: NativeError, action: string): any {
  let message = ''

  if (err.hasOwnProperty('code') && (<any>err).code === 11000) {
    switch (action) {
      case CONST.USER_ACTIONS.CONSUMER.LIKE:
      case CONST.USER_ACTIONS.CONSUMER.DISLIKE:
      case CONST.USER_ACTIONS.CONSUMER.SAVE:
      case CONST.USER_ACTIONS.CONSUMER.FOLLOW:
        message = 'ACTION_DUPLICATED'
      break
    }
  }

  return {message}
}

/**
 * Returns a data model object by its name
 * 
 * @param {string} key 
 */
export function getModelFromKey(key: string): any {
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

    case 'signup':
      // dataModel = Signup
    break

    case 'order':
      // dataModel = Order
    break

    case 'comment':
      dataModel = Comment
    break
}

  return dataModel
}

export function getModelFromPath(path: string): string {
  let key = path.toLowerCase(),
    model = ''

  switch (key) {
    case 'posts':
      model = 'Post'
    break

    case 'events':
      model = 'Event'
    break

    case 'signups':
      model = 'Signup'
    break

    case 'orders':
      model = 'Order'
    break

    case 'comments':
      model = 'Comment'
    break
  }

  return model
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
export function addComment(doc: any, rating: number): void {
  doc.totalRating += rating
  doc.commentCount++
  doc.save()
}

/**
 * Updates total rating when a comment is updated 
 * 
 * @param {any} doc 
 * @param {number} diff 
 * @returns {void}
 */
export function updateComment(doc: any, diff: number): void {
  if (diff !== 0) {
    doc.totalRating += diff
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
export function removeComment(doc: any, rating: number): void {
  doc.totalRating -= rating
  doc.commentCount--
  doc.save()
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
    sort[prop] = getListSortOrder(req)
  } else {
    // descending order by default sort order
    sort = CONST.DEFAULT_SORT_ORDER
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
    key: string = getPropKey(field),
    list: string = getRequestParam(req, key).replace(/\, /g, ',')

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
  let keywords = getRequestParam(req, 'keywords')

  if (keywords && keywords.length > 0) {
    let rx = assembleKeywordRx(keywords),
      $or: any[] = [],
      arr: string[] = fields.trim().split(',')

    arr.forEach(key => {
      let tmp: any = {}
      tmp[key.trim()] = rx
      $or.push(tmp)
    })

    return $or
  }

  return null
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

export function assembleSearchParams(req: Request, query: any = {}, keyFields?: string): any {
  let page: number = getListPageIndex(req),
    count: number = getListCountPerPage(req),
    sort: any = getListSort(req)

  if (this.isNotUndefinedNullEmpty(keyFields) && this.isNotUndefinedNullEmpty(getRequestParam(req, 'keywords'))) {
    query.$or = getListKeywordQuery(req, keyFields)
  }

  return {
    query,
    skip: page * count,
    limit: count,
    sort
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
 * @param {string[]]} keys 
 */
export function setUpdateTime(doc: Document, keys: string[]): void {
  let toUpdate = false

  keys.map((key: string) => {
    toUpdate = (doc.isModified(key)) ? true : toUpdate
  })

  if (toUpdate) {
    (<any>doc).updated = this.getTimestamp()
  }
}

/**
 * Sanitize user input to ensure 
 * certain fields can only be updated via program
 * 
 * @export
 * @param {Document} doc 
 * @param {string[]]} keys 
 */
export function sanitizeInput(model: string, body: any): any {
  let keyList: string = '_id,status,updated,totalRating,commentCount,viewCount,likeCount,dislikeCount,saveCount,shareCount,downloadCount,device',
    keyArray: string[] = []
  
  switch (model) {
    case CONST.ACTION_TARGETS.POST:
      keyArray = keyList.split(',')
    break
  }

  keyArray.forEach((key: string) => {
    if (body.hasOwnProperty(key)) {
      delete body[key]
    }
  })

  return body
}