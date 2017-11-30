import { Schema, model } from 'mongoose'

import * as CONST from '../../../common/options/constants'

import ILog from '../interfaces/ILog'

let LogSchema: Schema = new Schema({
  // user id
  creator: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // user type
  ref: {
    type: String,
    enum: CONST.USER_TYPES_ENUM,
    required: true
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
  // additional action information
  misc: {
    type: String,
    default: ''
  },
  // request user agent information
  ua: {
    type: Object
  }
})

export default model<ILog>('Log', LogSchema)
