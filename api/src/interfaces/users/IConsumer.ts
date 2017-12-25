import { Schema } from 'mongoose'
import IUser from './IUser'
import IHistory from './IHistory'

export default interface IConsumer extends IUser {
  intro?: string
  wechat: string
  contacts: Schema.Types.ObjectId[]
  history: IHistory[]
  points: number
  level?: number
  balance: number
  viewCount: number
  commentCount: number
  postCount: number
  eventCount: number
  signupCount: number
  orderCount: number

  // virtual fields
  posts: Schema.Types.ObjectId[]
  events: Schema.Types.ObjectId[]
  orders: Schema.Types.ObjectId[]
  likes: Schema.Types.ObjectId[]
  dislikes: Schema.Types.ObjectId[]
  saves: Schema.Types.ObjectId[]
  shares: Schema.Types.ObjectId[]
  followings: Schema.Types.ObjectId[]
  followers: Schema.Types.ObjectId[]

  // methods
  addToBalance: Function
}