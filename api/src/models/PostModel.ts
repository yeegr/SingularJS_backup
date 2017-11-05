import {
  Schema,
  model
} from 'mongoose'

import * as CONST from '../../../common/values/constants.json'
import * as UTIL from '../../../common/util'

import Consumer from './ConsumerModel'
import IConsumer from '../interfaces/IConsumer'

import IPost from '../interfaces/IPost'

let PostSchema: Schema = new Schema({
  // creator
  author: {
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
    enum: (<any>CONST).STATUSES.POST,
    default: (<any>CONST).STATUSES.POST[0]
  },
  // last updated time
  updated: {
    type: Number,
    required: true,
    default: UTIL.getTimestamp()
  },
  // publish time
  publish: Number,
  // total number of views
  viewCount: {
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
  // user likes (voted up)
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Consumer'
  }],
  // user dislikes (voted down)
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: 'Consumer'
  }],
  // number of saves by other users
  saves: [{
    type: Schema.Types.ObjectId,
    ref: 'Consumer'
  }],
  // number of shares by users
  shares: [{
    type: Schema.Types.ObjectId,
    ref: 'Consumer'
  }]
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

PostSchema.virtual('averageRating').get(function() {
  return Math.round(this.totalRating / this.comments.length * 2) / 2
})

PostSchema.methods.addView = function() {
  this.totalRating += 1
  this.save()
}

PostSchema.methods.addComment = function(id: Schema.Types.ObjectId, rating: number) {
  UTIL.addComment(this.comments, this.totalRating, id, rating)
  this.save()
}

PostSchema.methods.removeComment = function(id: Schema.Types.ObjectId, rating: number) {
  UTIL.removeComment(this.comments, this.totalRating, id, rating)
  this.save()
}

PostSchema.pre('save', function(next: Function):void {
  UTIL.setUpdateTime(this, ['title', 'content', 'excerpt', 'hero', 'tags'])
  this.wasNew = this.isNew

  next()
})

PostSchema.post('save', function(doc: IPost) {
  Consumer.findById(doc.author, (err, user:IConsumer) => {
    if (user) {
      user.addToList('posts', doc._id)
    }
  })
})

export default model<IPost>('Post', PostSchema)
