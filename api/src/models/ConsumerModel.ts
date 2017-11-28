import {
  Schema,
  model
} from 'mongoose'

import * as bcrypt from 'bcrypt-nodejs'
import * as moment from 'moment'

import * as CONFIG from '../../../common/options/config'
import * as CONST from '../../../common/options/constants'
import * as UTIL from '../../../common/util'

import IConsumer from '../interfaces/IConsumer'

let ConsumerSchema: Schema = new Schema({
  // user handle or user name
  handle: {
    type: String,
    default: () => CONST.CONSUMER_HANDLE_PREFIX + UTIL.getTimestamp(),
    required: true,
    unique: true,
    minlength: CONST.INPUT_LIMITS.MIN_HANDLE_LENGTH,
    maxlength: CONST.INPUT_LIMITS.MAX_HANDLE_LENGTH,
    trim: true,
    index: true
  },
  // user password, may or may not required
  password: {
    type: String,
    default: '',
    trim: true
  },
  // user actual name
  name: {
    type: String,
    default: '',
    maxlength: CONST.INPUT_LIMITS.MAX_NAME_LENGTH,
    trim: true
  },
  // user gender / sex
  gender: {
    type: Number,
    validate: (val: number) => (val > -1)
  },
  // mobile phone number
  mobile: {
    type: String,
    default: '',
    trim: true,
    validation: (val: string) => UTIL.validateMobile(val)
  },
  // user email address
  email: {
    type: String,
    default: '',
    lowercase: true,
    trim: true,
    validation: (val: string) => UTIL.validateEmail(val)
  },
  // Chinese personal id number
  pid: {
    type: String,
    default: '',
    trim: true,
    validation: (val: string) => UTIL.validatePid(val)
  },
  // user self introduction
  intro: {
    type: String,
    minlength: 2,
    trim: true
  },
  // user avatar url
  avatar: {
    type: String,
    default: ''
  },
  // user homepage background image url
  background: {
    type: String,
    default: ''
  },
  // user language preference
  locale: {
    type: String,
    minlength: 2,
    maxlength: 5,
    trim: true,
    validator: (code: string) => UTIL.validateLocale(code)
  },
  // current user location
  city: {
    type: String,
    trim: true
  },
  // current user location
  country: {
    type: String,
    default: CONFIG.DEFAULT_COUNTRY_CODE,
    minlength: 2,
    maxlength: 2,
    trim: true,
    validator: (code: string) => UTIL.validateCountry(code)
  },
  // WeChat OpenID
  wechat: {
    type: String,
    default: '',
    trim: true
  },
  // last time user updated personal information
  updated: {
    type: Number,
    required: true,
    default: () => UTIL.getTimestamp()
  },
  // user type
  ref: {
    type: String,
    default: CONST.USER_TYPES.CONSUMER,
    enum: [CONST.USER_TYPES.CONSUMER],
    required: true
  },
  // user roles
  roles: {
    type: [String],
    required: true,
    default: [CONST.USER_ROLES.CONSUMER.MEMBER]
  },
  // current user status
  status: {
    type: String,
    enum: CONST.USER_STATUSES_ENUM,
    default: CONST.STATUSES.USER.ACTIVE
  },
  // user verification
  verified: {
    type: Schema.Types.ObjectId,
    ref: 'Log'
  },
  // user verification expiration time
  expires: {
    type: Number
  },
  // other users
  contacts: [{
    type: Schema.Types.ObjectId,
    ref: 'Consumer'
  }],
  // number of posts authored by user
  postCount: {
    type: Number,
    default: 0
  },
  // number of events created by user
  eventCount: {
    type: Number,
    default: 0
  },
  // number events signuped by user
  signupCount: {
    type: Number,
    default: 0
  },
  // number of orders placed by user
  orderCount: {
    type: Number,
    default: 0
  },
  // number of comments posted by user
  commentCount: {
    type: Number,
    default: 0
  },
  // number of followers | fans
  totalFollowers: {
    type: Number,
    default: 0
  },
  // number of followings
  totalFollowings: {
    type: Number,
    default: 0
  },
  // user points
  points: {
    type: Number,
    default: 0
  },
  // user level
  level: {
    type: Number
  },
  // user account balance
  balance: {
    type: Number,
    default: 0
  },
  // user information retrieved
  viewCount: {
    type: Number,
    default: 0,
    validation: (val: number) => (val > -1)
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
 * Posts authored by user
 */
ConsumerSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'creator'
})

/**
 * Events created by user
 */
ConsumerSchema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Events signuped by user
 */
ConsumerSchema.virtual('signups', {
  ref: 'Signup',
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Orders placed by user
 */
ConsumerSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Comments posted by user
 */
ConsumerSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Likes
 */
ConsumerSchema.virtual('likes', {
  ref: CONST.ACTION_MODELS.LIKE,
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Dislikes
 */
ConsumerSchema.virtual('dislikes', {
  ref: CONST.ACTION_MODELS.DISLIKE,
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Saves
 */
ConsumerSchema.virtual('saves', {
  ref: CONST.ACTION_MODELS.SAVE,
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Dislikes
 */
ConsumerSchema.virtual('shares', {
  ref: CONST.ACTION_MODELS.SHARE,
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Downloads
 */
ConsumerSchema.virtual('downloads', {
  ref: CONST.ACTION_MODELS.DOWNLOAD,
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Followers
 */
ConsumerSchema.virtual('followers', {
  ref: CONST.ACTION_MODELS.FOLLOW,
  localField: '_id',
  foreignField: 'following',
  justOne: false
})

/**
 * Followings
 */
ConsumerSchema.virtual('followings', {
  ref: CONST.ACTION_MODELS.FOLLOW,
  localField: '_id',
  foreignField: 'follower',
  justOne: false
})

/**
 * Balances user account
 *
 * @class ConsumerSchema
 * @method addToBalance
 * @param {number} subTotal
 * @returns number
 */
ConsumerSchema.methods.addToBalance = function(subTotal: number): number {
  this.balance += subTotal
  this.save()

  return this.balance
}

/**
 * Hash incoming password with and
 * compare it to stored password hash
 *
 * @class ConsumerSchema
 * @method comparePassword
 * @param {string} candidatePassword
 * @param {function} callback
 * @returns void
 */
ConsumerSchema.methods.comparePassword = function(candidatePassword: string, callback: Function): void {
  bcrypt
  .compare(candidatePassword, this.password, (err, isMatch: boolean) => {
    if (err) { return callback(err) }
    callback(null, isMatch)
  })
}

ConsumerSchema.pre('save', function(next: Function): void {
  let user = this

  // generate a salt then run callback
  if (user.isNew) {
    bcrypt
    .genSalt(10, (err: Error, salt: string) => {
      if (err) { return next(err) }

      // encrypt password with salt
      bcrypt.hash(user.password, salt, null, (err, hash) => {
        if (err) { return next(err) }

        // overwrite plain text password with encrypted password
        user.password = hash

        next()
      })
    })
  } else {
    UTIL.setUpdateTime(user, ['handle', 'password', 'name', 'gender', 'intro', 'email', 'mobile', 'avatar', 'background'])
    user.wasNew = user.isNew

    next()
  }
})


export default model<IConsumer>('Consumer', ConsumerSchema)
