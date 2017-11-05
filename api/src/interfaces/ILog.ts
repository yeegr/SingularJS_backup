import {
  Document,
  Schema
} from 'mongoose'

export default interface ILog extends Document {
  _id: Schema.Types.ObjectId
  creator: Schema.Types.ObjectId
  type: string
  action: string
  info: string
  target?: string
  ref?: Schema.Types.ObjectId
  device: object
}