import {
  Document,
  Schema
} from 'mongoose'

export default interface IComment extends Document {
  _id: Schema.Types.ObjectId
  creator: Schema.Types.ObjectId
  type: string
  target: string
  ref: string
  rating?: number
  content: string

  isNew: boolean
  wasNew: boolean
}