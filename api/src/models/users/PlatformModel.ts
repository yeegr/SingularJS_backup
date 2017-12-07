import { Schema, model } from 'mongoose'
import * as bcrypt from 'bcrypt-nodejs'
import * as moment from 'moment'
import * as validator from 'validator'

import * as CONFIG from '../../../../common/options/config'
import * as CONST from '../../../../common/options/constants'
import * as UTIL from '../../../../common/util'

import IPlatform from '../../interfaces/users/IPlatform'

let PlatformSchema: Schema = new Schema({
  // user type
  ref: {
    type: String,
    default: CONST.USER_TYPES.PLATFORM,
    enum: [CONST.USER_TYPES.PLATFORM],
    required: true
  },
  // user password, hashed
  password: {
    type: String,
    default: '',
    required: true
  },
  // user actual name
  name: {
    type: String,
    default: '',
    maxlength: CONFIG.INPUT_LIMITS.MAX_NAME_LENGTH,
    trim: true
  },
  // user gender || sex
  gender: {
    type: Number,
    validate: (val: number) => (val > -1)
  },
  // personal id number
  pid: {
    type: String,
    default: '',
    trim: true,
    validation: (val: string) => UTIL.isChinaPid(val) // check against Chinese PID
  },
  // mobile phone number
  mobile: {
    type: String,
    default: '',
    trim: true,
    validation: (val: string) => validator.isMobilePhone(val, CONFIG.DEFAULT_LOCALE)
  },
  // user email address
  email: {
    type: String,
    default: '',
    lowercase: true,
    trim: true,
    validation: (val: string) => validator.isEmail(val)
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
    validator: (code: string) => UTIL.isLocaleCode(code)
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
    validator: (code: string) => UTIL.isCountryCode(code)
  },
  // last time user updated personal information
  updated: {
    type: Number,
    required: true,
    default: () => UTIL.getTimestamp()
  },
  // user roles
  roles: {
    type: [String],
    required: true,
    default: [CONST.USER_ROLES.PLATFORM.ADMIN]
  },
  // current user status
  status: {
    type: String,
    enum: CONST.PLATFORM_STATUSES_ENUM,
    default: CONST.STATUSES.PLATFORM.SUSPENDED
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
  // user name
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: CONFIG.INPUT_LIMITS.MIN_USERNAME_LENGTH,
    maxlength: CONFIG.INPUT_LIMITS.MAX_USERNAME_LENGTH,
    trim: true,
    index: true
  },
  // user nickname
  nickname: {
    type: String,
    default: '',
    trim: true,
    index: true
  },
  // number of activities completed by user
  activityCount: {
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
 * Activities handled | responded by user
 */
PlatformSchema.virtual('activities', {
  ref: 'Activity',
  localField: '_id',
  foreignField: 'handler'
})

/**
 * Hash incoming password with salt and
 * compare it to stored password hash
 *
 * @class PlatformSchema
 * @method comparePassword
 * @param {string} candidatePassword
 * @param {function} callback
 * @returns {void}
 */
PlatformSchema.methods.comparePassword = function(candidatePassword: string, callback: Function): void {
  bcrypt
  .compare(candidatePassword, this.password, (err, isMatch: boolean) => {
    if (err) { return callback(err) }
    callback(null, isMatch)
  })
}

PlatformSchema.pre('save', function(next: Function): void {
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
    UTIL.setUpdateTime(user, ['username', 'password', 'nickname', 'name', 'gender', 'mobile', 'email', 'pid', 'avatar', 'background', 'locale', 'city', 'country'])
    user.wasNew = user.isNew

    next()
  }
})

export default model<IPlatform>('Platform', PlatformSchema)
