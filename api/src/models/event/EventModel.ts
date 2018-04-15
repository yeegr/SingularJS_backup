import { Schema, model } from 'mongoose'
import * as validator from 'validator'

import { CONFIG, CONST } from '../../../../common'
import * as UTIL from '../../modules/util'

import Consumer, { IConsumer } from '../users/ConsumerModel'

import Agenda from './AgendaModel'
import Attendee from './AttendeeModel'
import Media from '../share/MediaModel'
import Point from '../share/PointModel'
import Subset from './SubsetModel'

import IEvent from '../../interfaces/event/IEvent'

let EventSchema: Schema = new Schema({
  // organizer id
  creator: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // organizer type
  creatorRef: {
    type: String,
    required: true,
    enum: CONST.USER_TYPES_ENUM,
    default: CONST.USER_TYPES.CONSUMER
  },
  // slug: http://domain/events/{{slug}}
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
  // TODO: publish time
  publish: {
    type: Number
  },
  // TODO: set whether event is opened to public signup
  isPublic: {
    type: Boolean,
    default: true,
    required: true
  },
  // TODO: set whether signup requires approval
  requireApproval: {
    type: Boolean,
    default: false
  },
  // additional information such as
  // difficulty level, intensity level, etc.
  misc: [{
    key: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  // additional destination information
  destination: {
    type: String
  },
  // list of notes
  notes: [String],
  // media gallery
  gallery: [Media],
  // list of gears to bring
  gears: [Schema.Types.Mixed],
  // city
  city: {
    type: String,
    trim: true
  },
  // 2-letter country code
  country: {
    type: String,
    default: CONFIG.DEFAULT_COUNTRY_CODE,
    minlength: 2,
    maxlength: 2,
    trim: true,
    validator: (code: string) => UTIL.isCountryCode(code)
  },
  // maximum attendence cap
  maxAttendee: {
    type: Number,
    default: CONFIG.DEFAULT_EVENT_MAX_ATTENDEE
  },
  // minimum attendence required
  minAttendee: {
    type: Number,
    default: CONFIG.DEFAULT_EVENT_MIN_ATTENDEE
  },
  // expenses
  expenses: {
    deposit: {
      type: Number,
      default: 0
    },
    perHead: {
      type: Number,
      default: 0
    },
    insurance: {
      type: Number,
      default: 0
    },
    detail: [String],
    includes: [String],
    excludes: [String]
  },
  // contact information
  contacts: [{
    handle: {
      type: String,
      required: true,
      trim: true
    },
    mobile: {
      type: String,
      default: '',
      trim: true,
      validation: (val: string) => validator.isMobilePhone(val, CONFIG.DEFAULT_LOCALE)
    },
    email: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
      validation: (val: string) => validator.isEmail(val)
    }
  }],
  // schedule
  schedule: [Agenda],
  // repeating groups
  subsets: [Subset],
  // current status
  status: {
    type: String,
    required: true,
    enum: CONST.CONTENT_STATUSES_ENUM,
    default: CONST.STATUSES.CONTENT.EDITING
  },
  // last modified time
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
EventSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'target'
})

/**
 * Likes submitted by users
 */
EventSchema.virtual('likes', {
  ref: CONST.ACTION_MODELS.LIKE,
  localField: '_id',
  foreignField: 'target'
})

/**
 * Disikes submitted by users
 */
EventSchema.virtual('dislikes', {
  ref: CONST.ACTION_MODELS.DISLIKE,
  localField: '_id',
  foreignField: 'target'
})

/**
 * Instances of savings by users
 */
EventSchema.virtual('saves', {
  ref: CONST.ACTION_MODELS.SAVE,
  localField: '_id',
  foreignField: 'target'
})

/**
 * Instances of sharings by users
 */
EventSchema.virtual('shares', {
  ref: CONST.ACTION_MODELS.SHARE,
  localField: '_id',
  foreignField: 'target'
})

/**
 * Creates a virtual 'averageRating' property
 */
EventSchema.virtual('averageRating').get(function() {
  return UTIL.getAverageRating(this)
})

EventSchema.pre('save', function(next: Function): void {
  // Set last modified time when values of only following props are changed
  UTIL.setUpdateTime(this, ['slug', 'title', 'content', 'excerpt', 'hero', 'tags', 'publish', 'isPublic', 'requireApproval', 'misc', 'destination', 'gallery', 'notes', 'gears', 'city', 'country', 'expenses', 'contacts', 'schedule', 'subsets'])
  this.wasNew = this.isNew

  next()
})

export { IEvent }

export default model<IEvent>('Event', EventSchema)
