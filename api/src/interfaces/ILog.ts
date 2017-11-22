import {
  Document,
  Schema
} from 'mongoose'

export default interface ILog extends Document {
  _id: Schema.Types.ObjectId
  creator: Schema.Types.ObjectId
  type: string
  action: string
  misc?: string
  target?: string
  ref?: Schema.Types.ObjectId
  device: any
}