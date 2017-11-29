import { Schema, model } from 'mongoose'

import * as CONST from '../../../common/options/constants'

import IErr from '../interfaces/IErr'

let ErrSchema: Schema = new Schema({
  // user id
  creator: {
    type: Schema.Types.ObjectId,
    default: null
  },
  // user type
  ref: {
    type: String,
    enum: CONST.USER_TYPES_ENUM
  },
  // action target
  type: {
    type: String,
    enum: CONST.ACTION_TARGETS_ENUM
  },
  // target id
  target: {
    type: Schema.Types.ObjectId
  },
  // user action
  action: {
    type: String,
    required: true
  },
  // internal error code
  status: {
    type: Number,
    default: 500
  },
  // internal error code
  code: {
    type: Number,
    default: 11000
  },
  // model key
  key: {
    type: String,
    default: ''
  },
  // error message
  message: {
    type: String,
    default: ''
  },
  // user login device info
  device: {
    type: Object
  }
})

export default model<IErr>('Err', ErrSchema)
