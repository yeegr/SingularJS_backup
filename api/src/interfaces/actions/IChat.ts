import { Document, Schema } from 'mongoose'
import IMessage from '../share/IMessage'

export default interface IChat extends Document {
  _id: Schema.Types.ObjectId
  creator: Schema.Types.ObjectId
  creatorRef: string
  name: string
  members: [{
    user: Schema.Types.ObjectId
    userRef: string
  }]
  messages: IMessage[]

  wasNew: boolean
}