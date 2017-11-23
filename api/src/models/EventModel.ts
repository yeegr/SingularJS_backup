import {
  Schema,
  model
} from 'mongoose'

import * as CONFIG from '../../../common/options/config'
import * as CONST from '../../../common/options/constants'
import * as UTIL from '../../../common/util'

import Consumer from './ConsumerModel'
import IConsumer from '../interfaces/IConsumer'

import IEvent from '../interfaces/IEvent'

import Agenda from './AgendaModel'
import Photo from './PhotoModel'
import Point from './PointModel'
import Attendee from './AttendeeModel'

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
    validator: (code: string) => UTIL.validateCountry(code)
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
      validation: (val: string) => UTIL.validateMobile(val)
    },
    email: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
      validation: (val: string) => UTIL.validateEmail(val)
    }
  }],
  // event schedule
  schedule: [Agenda],
  // repeating groups
  subsets: [{
    _id: false,
    title: {
      type: String
    },
    misc: {
      type: String
    },
    startDate: {
      type: Number,
      required: true
    },
    deadline: {
      type: Number
    },
    // rally location
    rallyPoint: Point,
    // rally time in minutes
    rallyTime: {
      type: Number,
      min: 0,
      max: 1439
    },
    status: {
      type: String,
      enum: CONST.SET_STATUSES_ENUM,
      default: CONST.STATUSES.SET.ACCEPTING
    },
    // attendees | participants
    // attendees: [Attendee]
  }],
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
    validate: (val: Number) => (val > -1)
  },
  // total rating
  totalRating: {
    type: Number,
    default: 0,
    validate: (val: Number) => (val > -1)
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
  // total number of downloads by user
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
EventSchema.virtual('averageRating').get(function() {
  return Math.round(this.totalRating / this.comments.length * 2) / 2
})

/**
 * Adds a comment to event
 *
 * @class PostSchema
 * @method addComment
 * @param {Schema.Types.ObjectId} id
 * @param {number} rating
 * @returns {void}
 */
EventSchema.methods.addComment = function(id: Schema.Types.ObjectId, rating: number) {
  UTIL.addComment(this, id, rating)
}

/**
 * Removes a comment from event
 *
 * @class EventSchema
 * @method removeComment
 * @param {Schema.Types.ObjectId} id
 * @param {number} rating
 * @returns {void}
 */
EventSchema.methods.removeComment = function(id: Schema.Types.ObjectId, rating: number) {
  UTIL.removeComment(this, id, rating)
}

/**
 * Adds 1 (or -1) to counter
 *
 * @class EventSchema
 * @method addCount
 * @param {string} key
 * @param {Function} [callback]
 * @param {number} [step = 1]
 * @returns {void}
 */
EventSchema.methods.addCount = function(key: string, callback?: Function, step: number = 1) {
  UTIL.addCount(this, key, callback, step)
}

EventSchema.pre('save', function(next):void {
  UTIL.setUpdateTime(this, ['title', 'description', 'excerpt', 'hero', 'tags'])
  this.wasNew = this.isNew

  next()
})

EventSchema.post('save', function(doc: IEvent) {
  if (doc.isNew) {
    let UserModel = UTIL.selectDataModel(doc.ref)

    UserModel
    .findById(doc.creator)
    .then((user: any) => {
      if (user) {
        user.addToList('events', doc._id)
      }
    })
    .catch((err: Error) => {
      console.log(err)
    })
  }
})

export default model<IEvent>('Event', EventSchema)
