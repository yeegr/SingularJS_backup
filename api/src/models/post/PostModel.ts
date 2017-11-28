import { Schema, model } from 'mongoose'

import * as CONST from '../../../../common/options/constants'
import * as UTIL from '../../../../common/util'

import Consumer from '../users/ConsumerModel'
import IConsumer from '../../interfaces/users/IConsumer'

import IPost from '../../interfaces/post/IPost'

let PostSchema: Schema = new Schema({
  // creator
  creator: {
    type: Schema.Types.ObjectId,
    ref: CONST.USER_TYPES.CONSUMER,
    required: true
  },
  // post slug
  slug: {
    type: String,
    default: '',
    unique: true,
    lowercase: true
  },
  // post title
  title: {
    type: String,
    default: '',
    required: true
  },
  // post content
  content: {
    type: String,
    default: ''
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
  // publish date
  publish: {
    type: Number
  },
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
    virtuals: true
  },
  toJSON: {
    virtuals: true
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
  return (this.commentCount > 0) ? Math.round(this.totalRating / this.commentCount * 2) / 2 : null
})

PostSchema.pre('save', function(next: Function): void {
  // Set last modified time when values of only following props are changed
  UTIL.setUpdateTime(this, ['slug', 'title', 'content', 'excerpt', 'hero', 'tags', 'publish'])
  this.wasNew = this.isNew

  next()
})

export default model<IPost>('Post', PostSchema)
