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

import Pointer from './PointerModel'
import IPointer from '../interfaces/IPointer'

import Logger from '../routers/_Logger'

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
  type: {
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
  // posts authored by user
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  // events authored by user
  events: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }],
  // orders placed by user
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }],
  // comments written by user
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  // contents liked (voted up) by user
  likes: [Pointer],
  // contents liked (voted down) by user
  dislikes: [Pointer],
  // contents saved by user
  saves: [Pointer],
  // contents shared by user
  shares: [Pointer],
  // contents downloaded by user
  downloads: [Pointer],
  // other users being followed by user
  followings: [{
    type: Schema.Types.ObjectId,
    ref: 'Consumer'
  }],
  // other users following user
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'Consumer'
  }],
  // other users following user
  feedbacks: [{
    type: Schema.Types.ObjectId,
    ref: 'Feedback'
  }],
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
  totalViews: {
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
 * Adds an item to specified list
 *
 * @class ConsumerSchema
 * @method addToList
 * @param {string} key
 * @param {Schema.Types.ObjectId} id
 * @return void
 */
ConsumerSchema.methods.addToList = function(key: string, id: Schema.Types.ObjectId, callback?: Function): void {
  UTIL.addToList(this, key, id, callback)
}

/**
 * Removes an item from specified list
 *
 * @class ConsumerSchema
 * @method removeFromList
 * @param {string} key
 * @param {Schema.Types.ObjectId} id
 * @returns void
 */
ConsumerSchema.methods.removeFromList = function(key: string, id: Schema.Types.ObjectId, callback?: Function): void {
  UTIL.removeFromList(this, key, id, callback)
}

ConsumerSchema.methods.addToArray = function(key: string, target: string, ref: Schema.Types.ObjectId, callback?: Function): void {
  let arr = this[key],
    index = arr.findIndex((e: IPointer) => (e.ref.toString() == ref.toString() && e.target === target))

  if (index < 0) {
    arr.push({ref, target})

    this
    .save()
    .then((user: IConsumer) => {
      this.saveCountToTarget(key, target, ref, callback)
    })
    .catch((err: Error) => {
      console.log(err)
    })
  } else if (key === 'shares' || key === 'downloads') {
    this.saveCountToTarget(key, target, ref, callback)
  } else if (callback) {
    callback()
  }
}

ConsumerSchema.methods.saveCountToTarget = function(key: string, target: string, ref: Schema.Types.ObjectId, callback?: Function, step: number = 1): void {
  let TargetModel = UTIL.selectDataModel(target)

  TargetModel
  .findById(ref)
  .then((data: any) => {
    switch (key) {
      case 'likes':
        data.addCount('totalLikes', callback, step)
      break

      case 'dislikes':
        data.addCount('totalDislikes', callback, step)
      break

      case 'saves':
        data.addCount('totalSaves', callback, step)
      break

      case 'shares':
        data.addCount('totalShares', callback, step)
      break

      case 'downloads':
        data.addCount('totalDownloads', callback, step)
      break
    }
  })
  .catch((err: Error) => {
    console.log(err)
  })
}

ConsumerSchema.methods.removeFromArray = function(key: string, target: string, ref: Schema.Types.ObjectId, callback?: Function): void {
  let arr = this[key],
    index = arr.findIndex((e: IPointer) => (e.ref.toString() == ref.toString() && e.target === target))

  if (index > -1) {
    arr.splice(index, 1)

    this
    .save()
    .then((user: IConsumer) => {
      this.saveCountToTarget(key, target, ref, callback, -1)
    })
    .catch((err: Error) => {
      console.log(err)
    })
  } else if (callback) {
    callback()
  }
}

/**
 * Balances user account
\*
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
