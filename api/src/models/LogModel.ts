import {
  Schema,
  model
} from 'mongoose'

import * as CONST from '../../../common/values/constants.json'
import * as UTIL from '../../../common/util'

import ILog from '../interfaces/ILog'

let LogSchema: Schema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    required: true
  },
  type: {
    type: String,
    enum: (<any>CONST).USER_TYPES,
    required: true
  },
  action: {
    type: String,
    enum: (<any>CONST).ACTIONS,
    required: true
  },
  info: {
    type: String,
    default: ''
  },
  target: {
    type: String,
    enum: (<any>CONST).TARGETS
  },
  ref: {
    type: Schema.Types.ObjectId
  },
  device: {
    type: Object
  }
})

export default model<ILog>('Log', LogSchema)
