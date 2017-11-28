import {
  Document,
  Schema
} from 'mongoose'

export default interface ILog extends Document {
  _id: Schema.Types.ObjectId
  creator: Schema.Types.ObjectId
  ref: string
  type?: string
  target?: Schema.Types.ObjectId
  action: string
  misc?: string
  device: any
}