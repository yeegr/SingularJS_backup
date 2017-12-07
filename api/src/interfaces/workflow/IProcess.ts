import { Document, Schema } from 'mongoose'

export default interface IProcess extends Document {
  _id: Schema.Types.ObjectId
  creator: Schema.Types.ObjectId
  creatorRef: string
  target: Schema.Types.ObjectId
  targetRef: string
  type: string
  activities: Schema.Types.ObjectId[]
  status: string
  expireAt?: number
  completedAt?: number

  finalize: Function
  addActivity: Function
  returnData: Function
}