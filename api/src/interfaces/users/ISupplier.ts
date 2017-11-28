import { Document, Schema } from 'mongoose'

export default interface ISupplier extends Document {
  _id: Schema.Types.ObjectId
}