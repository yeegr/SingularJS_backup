import { Document, Schema } from 'mongoose'

export default interface ITotp extends Document {
  _id: Schema.Types.ObjectId
  user?: Schema.Types.ObjectId
  action: string
  type: string
  value: string
  code: string
  expireAt: number
  verifiedAt?: number
  ip?: string
}