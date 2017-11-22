import {
  Document,
  Schema
} from 'mongoose'

export default interface IPointer extends Document {
  ref: Schema.Types.ObjectId
  target: string
}