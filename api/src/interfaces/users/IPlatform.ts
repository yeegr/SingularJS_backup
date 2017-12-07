import { Schema } from 'mongoose'
import IUser from './IUser'

export default interface IPlatform extends IUser {
  username: string
  nickname: string
  activityCount: number

  // virtual fields
  activities: Schema.Types.ObjectId[]
}