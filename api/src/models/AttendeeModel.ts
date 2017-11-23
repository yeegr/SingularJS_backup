import {
  Schema,
  model
} from 'mongoose'

import * as CONST from '../../../common/options/constants'
import * as UTIL from '../../../common/util'

import IAttendee from '../interfaces/IAttendee'

let AttendeeSchema: Schema = new Schema({
  // signup time
  added: {
    type: Number,
    required: true
  },
  // user handle
  handle: {
    type: String,
    default: ''
  },
  // user real name
  name: {
    type: String,
    default: ''
  },
  // user gender / sex
  gender: {
    type: Number,
    validate: (val: number) => (val > -1)
  },
  // level of experties to help calculate cost if necessary
  exp: {
    type: Number
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
  // signup cost
  cost: {
    type: Number,
    validation: (val: number) => UTIL.validateCurrency(val)
  },
  // user signup status
  status: {
    type: String,
    enum: CONST.SIGNUP_STATUSES_ENUM,
    default: CONST.STATUSES.SIGNUP.PENDING
  }
}, {
  _id: false
})

export default AttendeeSchema
