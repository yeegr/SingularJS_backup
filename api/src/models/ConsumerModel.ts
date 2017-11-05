import {
  Schema,
  model
} from 'mongoose'

import * as bcrypt from 'bcrypt-nodejs'
import * as moment from 'moment'

import * as CONST from '../../../common/values/constants.json'
import * as UTIL from '../../../common/util'

import IConsumer from '../interfaces/IConsumer'

let ConsumerSchema: Schema = new Schema({
  // user handle or user name
  handle: {
    type: String,
    default: () => 'Consumer_' + UTIL.getTimestamp(),
    required: true,
    unique: true,
    minlength: (<any>CONST).LIMITS.MIN_HANDLE_LENGTH,
    maxlength: (<any>CONST).LIMITS.MAX_HANDLE_LENGTH,
    trim: true,
    index: true
  },
  // user password, may or may not required
  password: {
    type: String,
    default: '',
    minlength: (<any>CONST).LIMITS.MIN_PASSWORD_LENGTH,
    maxlength: (<any>CONST).LIMITS.MAX_PASSWORD_LENGTH,
    trim: true
  },
  // user actual name
  name: {
    type: String,
    default: '',
    maxlength: (<any>CONST).LIMITS.MAX_NAME_LENGTH,
    trim: true
  },
// user gender / sex
  gender: {
    type: Number,
    validate: (val:number) => (val > -1)
  },
// Chinese personal id number
  pid: {
    type: String,
    default: '',
    match: new RegExp((<any>CONST).VALIDATORS.PID),
    validation: (value: String) => (value.length === (<any>CONST).VALIDATORS.PID_LENGTH),
    trim: true
  },
// user self introduction
  intro: {
    type: String,
    minlength: 2,
    trim: true
  },
// mobile phone number
  mobile: {
    type: String,
    default: '',
    trim: true
  },
  // user email address
  email: {
    type: String,
    default: '',
    match: new RegExp((<any>CONST).VALIDATORS.EMAIL),
    lowercase: true,
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
    match: new RegExp((<any>CONST).VALIDATORS.LOCALE),
    trim: true
  },
  // current user location
  city: {
    type: String,
    trim: true
  },
  // current user location
  country: {
    type: String,
    minlength: 2,
    maxlength: 2,
    match: new RegExp((<any>CONST).VALIDATORS.COUNTRY),
    trim: true
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
    default: () => moment().valueOf()
  },
  // user roles
  roles: {
    type: [String],
    required: true,
    default: [(<any>CONST).USER_ROLES.CONSUMER[0]]
  },
  // user's verification status
  verification: {
    type: String
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
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Log'
  }],
  // contents liked (voted down) by user
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: 'Log'
  }],
  // contents saved by user
  saves: [{
    type: Schema.Types.ObjectId,
    ref: 'Log'
  }],
  // contents shared by user
  shares: [{
    type: Schema.Types.ObjectId,
    ref: 'Log'
  }],
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
    validation: (value: number) => (value > -1)
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
 * add order to user order list
 *
 * @class ConsumerSchema
 * @method addToList
 * @param {string} key
 * @param {Schema.Types.ObjectId} id
 * @return void
 */
ConsumerSchema.methods.addToList = function(key: string, id: Schema.Types.ObjectId): void {
  let arr = this[key]

  if (arr.indexOf(id) < 0) {
    arr.push(id)
    this.save()
  }
}

/**
 * delete specific order from user order list
 *
 * @class ConsumerSchema
 * @method removeFromList
 * @param {string} key
 * @param {Schema.Types.ObjectId} id
 * @returns void
 */
ConsumerSchema.methods.removeFromList = function(key: string, id: Schema.Types.ObjectId): void {
  let arr = this[key]
  
  if (arr.indexOf(id) > -1) {
    arr.splice(arr.indexOf(id), 1)
    this.save()
  }
}

/**
 * balancing user account
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
 * balancing user account
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
