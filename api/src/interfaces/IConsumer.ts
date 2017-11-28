import {
  Document,
  Schema
} from 'mongoose'

export default interface IConsumer extends Document {
  [key: string]: any
  _id: Schema.Types.ObjectId
  handle: string
  password: string
  name: string
  gender?: number
  mobile: string
  email: string
  pid?: string
  intro?: string
  avatar: string
  background: string
  locale?: string
  city?: string
  country?: string
  wechat: string
  updated: number
  ref: string
  roles: string[]
  status: string
  verified?: Schema.Types.ObjectId
  expires?: number
  contacts: [Schema.Types.ObjectId]
  postCount: number
  eventCount: number
  signupCount: number
  orderCount: number
  commentCount: number
  points: number
  level?: number
  balance: number

  viewCount: number

  // virtual fields
  posts: [Schema.Types.ObjectId]
  events: [Schema.Types.ObjectId]
  orders: [Schema.Types.ObjectId]
  comments: [Schema.Types.ObjectId]
  likes: [Schema.Types.ObjectId]
  dislikes: [Schema.Types.ObjectId]
  saves: [Schema.Types.ObjectId]
  shares: [Schema.Types.ObjectId]
  followings: [Schema.Types.ObjectId]
  followers: [Schema.Types.ObjectId]

  // document status
  isNew: boolean
  wasNew: boolean

  // methods
  addToBalance: Function
  comparePassword: Function
}