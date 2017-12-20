import { Document, Schema } from 'mongoose'
import IMedia from './IMedia'
import IUri from './IUri'

export default interface IMessage extends Document {
  user: Schema.Types.ObjectId
  ref: string
  sendAt: number
  format: string
  txt?: string
  media?: IMedia
  url?: IUri
}