import { Schema } from 'mongoose'
import IUser from './IUser'

export default interface IPlatform extends IUser {
  activityCount: number

  // virtual fields
  activities: Schema.Types.ObjectId[]
}