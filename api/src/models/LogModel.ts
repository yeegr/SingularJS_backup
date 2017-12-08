import { Schema, model } from 'mongoose'

import { CONST } from '../../../common'

import ILog from '../interfaces/ILog'

let LogSchema: Schema = new Schema({
  // user id
  creator: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // user type
  creatorRef: {
    type: String,
    enum: CONST.USER_TYPES_ENUM,
    required: true
  },
  // target id
  target: {
    type: Schema.Types.ObjectId
  },
  // target reference
  targetRef: {
    type: String,
    enum: CONST.ACTION_TARGETS_ENUM
  },
  // user action
  action: {
    type: String,
    required: true
  },
  // additional action information
  state: {
    type: String,
    default: ''
  },
  // request user agent information
  ua: {
    type: Object
  }
})

export { ILog }

export default model<ILog>('Log', LogSchema)
