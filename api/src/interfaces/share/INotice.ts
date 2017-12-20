import { Document, Schema } from 'mongoose'

export default interface INotice extends Document {
  creator: Schema.Types.ObjectId
  creatoRef: string
  recipients: [{
    user: Schema.Types.ObjectId
    ref: string
    readAt?: number
    response?: string
  }]
  content: string
  choices?: string[]
  sendAt: number
}