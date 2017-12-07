import { Document, Schema } from 'mongoose'

export default interface ILog extends Document {
  _id: Schema.Types.ObjectId
  creator: Schema.Types.ObjectId
  creatorRef: string
  target?: Schema.Types.ObjectId
  targetRef?: string
  action: string
  state?: string
  ua: any
}