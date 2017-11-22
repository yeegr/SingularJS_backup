import {
  Schema,
  model
} from 'mongoose'

import * as CONST from '../../../common/options/constants'
import * as UTIL from '../../../common/util'

import Consumer from './ConsumerModel'
import IConsumer from '../interfaces/IConsumer'

import IEvent from '../interfaces/IEvent'

let EventSchema: Schema = new Schema({
  // organizer id
  creator: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // organizer type
  ref: {
    type: String,
    required: true,
    enum: CONST.USER_TYPES_ENUM,
    default: CONST.USER_TYPES.CONSUMER
  },
  // event title
  title: {
    type: String,
    default: '',
    required: true
  },
  // event slug
  slug: {
    type: String,
    default: '',
    required: true,
    unique: true,
    lowercase: true
  },
  // event description
  description: {
    type: String,
    default: '',
    required: true
  },
  // event excerpt
  excerpt: {
    type: String,
    default: ''
  },
  // hero image url
  hero: {
    type: String,
    default: ''
  },
  // maximum attendence cap
  maxAttendee: {
    type: Number,
    default: 200
  },
  // minimum attendence required
  minAttendee: {
    type: Number,
    default: 20
  },
  // event tags
  tags: [String],
  // current event status
  status: {
    type: String,
    required: true,
    enum: CONST.EVENT_STATUSES_ENUM,
    default: CONST.STATUSES.EVENT.EDITING
  },
  // last modified time
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
    validate: (val:Number) => (val > -1)
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
  // user likes
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Consumer'
  }],
  // user dislikes
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

EventSchema.virtual('averageRating').get(function() {
  return Math.round(this.totalRating / this.comments.length * 2) / 2
})

EventSchema.methods.addComment = function(id: Schema.Types.ObjectId, rating: number) {
  UTIL.addComment(this, id, rating)
}

EventSchema.methods.removeComment = function(id: Schema.Types.ObjectId, rating: number) {
  UTIL.removeComment(this, id, rating)
}

EventSchema.pre('save', function(next):void {
  UTIL.setUpdateTime(this, ['title', 'content', 'excerpt', 'hero', 'tags'])
  this.wasNew = this.isNew

  next()
})

EventSchema.post('save', function(doc: IEvent) {
  Consumer.findById(doc.creator, (err, user:IConsumer) => {
    if (user) {
      user.addToList('posts', doc._id)
    }
  })
})

export default model<IEvent>('Event', EventSchema)
