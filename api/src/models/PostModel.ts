import {
  Schema,
  model
} from 'mongoose'

import * as CONST from '../../../common/options/constants'
import * as UTIL from '../../../common/util'

import Consumer from './ConsumerModel'
import IConsumer from '../interfaces/IConsumer'

import IPost from '../interfaces/IPost'

let PostSchema: Schema = new Schema({
  // creator
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Consumer',
    required: true
  },
  // post title
  title: {
    type: String,
    default: '',
    required: true
  },
  // post slug
  slug: {
    type: String,
    default: '',
    required: true,
    unique: true,
    lowercase: true
  },
  // post content
  content: {
    type: String,
    default: '',
    required: true
  },
  // post excerpt
  excerpt: {
    type: String,
    default: ''
  },
  // hero image url
  hero: {
    type: String,
    default: ''
  },
  // post tags
  tags: [String],
  // post status
  status: {
    type: String,
    required: true,
    enum: CONST.POST_STATUSES_ENUM,
    default: CONST.STATUSES.POST.EDITING
  },
  // last updated time
  updated: {
    type: Number,
    required: true,
    default: () => UTIL.getTimestamp()
  },
  // publish time
  publish: Number,
  // total number of views
  totalViews: {
    type: Number,
    default: 0,
    validate: (value: Number) => (value > -1)
  },
  // total rating
  totalRating: {
    type: Number,
    default: 0,
    validate: (value: Number) => (value > -1)
  },
  // user comments
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  // total number of likes (voted up)
  totalLikes: {
    type: Number,
    default: 0
  },
  // total number of dislikes (voted down)
  totalDislikes: {
    type: Number,
    default: 0
  },
  // total number of saves by other users
  totalSaves: {
    type: Number,
    default: 0
  },
  // total number of shares by users
  totalShares: {
    type: Number,
    default: 0
  },
  totalDownloads: {
    type: Number,
    default: 0
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

/**
 * Creates a virtual 'averageRating' property
 */
PostSchema.virtual('averageRating').get(function() {
  return Math.round(this.totalRating / this.comments.length * 2) / 2
})

/**
 * add item to list
 *
 * @class ConsumerSchema
 * @method addToList
 * @param {string} key
 * @param {Schema.Types.ObjectId} id
 * @return void
 */
PostSchema.methods.addToList = function(key: string, id: Schema.Types.ObjectId): void {
  UTIL.addToList(this, key, id)
}

/**
 * delete item from list
 *
 * @class ConsumerSchema
 * @method removeFromList
 * @param {string} key
 * @param {Schema.Types.ObjectId} id
 * @returns void
 */
PostSchema.methods.removeFromList = function(key: string, id: Schema.Types.ObjectId): void {
  UTIL.removeFromList(this, key, id)
}

/**
 * Adds a comment to the post
 *
 * @class PostSchema
 * @method addComment
 * @param {Schema.Types.ObjectId} id
 * @param {number} rating
 * @returns {void}
 */
PostSchema.methods.addComment = function(id: Schema.Types.ObjectId, rating: number) {
  UTIL.addComment(this, id, rating)
}

/**
 * Removes a comment to the post
 *
 * @class PostSchema
 * @method removeComment
 * @param {Schema.Types.ObjectId} id
 * @param {number} rating
 * @returns {void}
 */
PostSchema.methods.removeComment = function(id: Schema.Types.ObjectId, rating: number) {
  UTIL.removeComment(this, id, rating)
}

/**
 * Adds 1 (or -1) to counter
 *
 * @class PostSchema
 * @method addCount
 * @param {string} key
 * @param {Function} [callback]
 * @param {number} [step = 1]
 * @returns {void}
 */
PostSchema.methods.addCount = function(key: string, callback?: Function, step: number = 1) {
  UTIL.addCount(this, key, callback, step)
}

PostSchema.pre('save', function(next: Function): void {
  UTIL.setUpdateTime(this, ['title', 'content', 'excerpt', 'hero', 'tags'])
  this.wasNew = this.isNew

  next()
})

PostSchema.post('save', function(doc: IPost) {
  if (doc.isNew) {
    Consumer
    .findById(doc.creator)
    .then((user: IConsumer) => {
      if (user) {
        user.addToList('posts', doc._id)
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }
})

export default model<IPost>('Post', PostSchema)
