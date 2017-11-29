import { Document, Schema } from 'mongoose'

export default interface IHistory extends Document {
  created: number
  type: string
  target: Schema.Types.ObjectId
}