import { Document, Schema } from 'mongoose'

export default interface ITotp extends Document {
  _id: Schema.Types.ObjectId
  action: string
  type: string
  value: string
  code: string
  expiredAt: number
  verifiedAt?: number
  ip?: string
}