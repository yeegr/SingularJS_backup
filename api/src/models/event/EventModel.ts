import { Schema, model } from 'mongoose'
import * as validator from 'validator'

import * as CONFIG from '../../../../common/options/config'
import * as CONST from '../../../../common/options/constants'
import * as UTIL from '../../../../common/util'

import Consumer from '../users/ConsumerModel'
import IConsumer from '../../interfaces/users/IConsumer'

import Agenda from './AgendaModel'
import Attendee from './AttendeeModel'
import Photo from '../share/PhotoModel'
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
  ref: {
    type: String,
    required: true,
    enum: CONST.USER_TYPES_ENUM,
    default: CONST.USER_TYPES.CONSUMER
  },
  // event slug
  slug: {
    type: String,
    default: '',
    required: true,
    unique: true,
    lowercase: true
  },
  // event title
  title: {
    type: String,
    default: '',
    required: true
  },
  // event description
  description: {
    type: String,
    default: '',
    required: true
  },
  // additional information such as
  // difficulty level, intensity level, etc.
  misc: [{
    _id: false,
    key: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
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
  // additional destination description
  destination: {
    type: String
  },
  // list of notes
  notes: [String],
  // photo gallery
  photos: [Photo],
  // list of gears to bring
  gears: [Schema.Types.Mixed],
  // list of tags
  tags: [String],
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
  // set wether event is opened to public signup
  isPublic: {
    type: Boolean,
    default: true,
    required: true
  },
  // set wether event signup requires approval
  requireApproval: {
    type: Boolean,
    default: false
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
  // event expenses
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
  // contact persons
  contacts: [{
    _id: false,
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
  // event schedule
  schedule: [Agenda],
  // repeating groups
  subsets: [Subset],
  // publish time
  publish: {
    type: Number
  },
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
 * Instances of downloads by users
 */
EventSchema.virtual('downloads', {
  ref: CONST.ACTION_MODELS.DOWNLOAD,
  localField: '_id',
  foreignField: 'target'
})

/**
 * Creates a virtual 'averageRating' property
 */
EventSchema.virtual('averageRating').get(function() {
  return (this.commentCount > 0) ? Math.round(this.totalRating / this.commentCount * 2) / 2 : null
})

EventSchema.pre('save', function(next: Function): void {
  // Set last modified time when values of only following props are changed
  UTIL.setUpdateTime(this, ['slug', 'title', 'description', 'excerpt', 'hero', 'location', 'destination', 'notes', 'gears', 'tags', 'city', 'country', 'expenses', 'contacts', 'schedule', 'subsets', 'publish'])
  this.wasNew = this.isNew

  next()
})

export default model<IEvent>('Event', EventSchema)
