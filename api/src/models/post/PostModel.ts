import { Schema, model } from 'mongoose'

import { CONST, UTIL } from '../../../../common'

import Consumer, { IConsumer } from '../users/ConsumerModel'

import IPost from '../../interfaces/post/IPost'

let PostSchema: Schema = new Schema({
  // author
  creator: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // author type
  ref: {
    type: String,
    required: true,
    enum: CONST.USER_TYPES_ENUM,
    default: CONST.USER_TYPES.CONSUMER
  },
  // slug: http://domain/posts/{{slug}}
  slug: {
    type: String,
    default: '',
    unique: true,
    lowercase: true
  },
  // title
  title: {
    type: String,
    default: '',
    required: true
  },
  // content
  content: {
    type: String,
    default: ''
  },
  // excerpt
  excerpt: {
    type: String,
    default: ''
  },
  // hero image url
  hero: {
    type: String,
    default: ''
  },
  // tags
  tags: [String],
  // TODO: publish date
  publish: {
    type: Number
  },
  // current status
  status: {
    type: String,
    required: true,
    enum: CONST.CONTENT_STATUSES_ENUM,
    default: CONST.STATUSES.CONTENT.EDITING
  },
  // last updated time
  updated: {
    type: Number,
    required: true,
    default: () => UTIL.getTimestamp()
  },
  // total rating
  totalRating: {
    type: Number,
    default: 0,
    validate: (val: Number) => (val > -1)
  },
  // total number of comments
  commentCount: {
    type: Number,
    default: 0
  },
  // total number of views
  viewCount: {
    type: Number,
    default: 0,
    validate: (val: Number) => (val > -1)
  },
  // total number of likes (voted up)
  likeCount: {
    type: Number,
    default: 0
  },
  // total number of dislikes (voted down)
  dislikeCount: {
    type: Number,
    default: 0
  },
  // total number of saves by other users
  saveCount: {
    type: Number,
    default: 0
  },
  // total number of shares by users
  shareCount: {
    type: Number,
    default: 0
  },
  // total number of downloads by user
  downloadCount: {
    type: Number,
    default: 0
  }
}, {
  toObject: {
    virtuals: false
  },
  toJSON: {
    virtuals: false
  }
})

/**
 * Comments posted by users
 */
PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'target'
})

/**
 * Likes submitted by users
 */
PostSchema.virtual('likes', {
  ref: CONST.ACTION_MODELS.LIKE,
  localField: '_id',
  foreignField: 'target'
})

/**
 * Disikes submitted by users
 */
PostSchema.virtual('dislikes', {
  ref: CONST.ACTION_MODELS.DISLIKE,
  localField: '_id',
  foreignField: 'target'
})

/**
 * Instances of savings by users
 */
PostSchema.virtual('saves', {
  ref: CONST.ACTION_MODELS.SAVE,
  localField: '_id',
  foreignField: 'target'
})

/**
 * Instances of sharings by users
 */
PostSchema.virtual('shares', {
  ref: CONST.ACTION_MODELS.SHARE,
  localField: '_id',
  foreignField: 'target'
})

/**
 * Instances of downloads by users
 */
PostSchema.virtual('downloads', {
  ref: CONST.ACTION_MODELS.DOWNLOAD,
  localField: '_id',
  foreignField: 'target'
})

/**
 * Creates a virtual 'averageRating' property
 */
PostSchema.virtual('averageRating').get(function() {
  return UTIL.getAverageRating(this)
})

PostSchema.pre('save', function(next: Function): void {
  // Set last modified time when values of only following props are changed
  UTIL.setUpdateTime(this, ['slug', 'title', 'content', 'excerpt', 'hero', 'tags', 'publish'])
  this.wasNew = this.isNew

  next()
})

export { IPost }

export default model<IPost>('Post', PostSchema)
