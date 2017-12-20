import { Document, Schema } from 'mongoose'

export default interface IAction extends Document {
  _id: Schema.Types.ObjectId
  creator: Schema.Types.ObjectId
  creatorRef: string
  target: Schema.Types.ObjectId
  targetRef: string

  wasNew: boolean
}