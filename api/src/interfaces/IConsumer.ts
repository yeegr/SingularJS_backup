import {
  Document,
  Schema
} from 'mongoose'

export default interface IConsumer extends Document {
  _id: Schema.Types.ObjectId
  handle: string
  password: string
  name: string
  gender?: number
  pid?: string
  intro?: string
  mobile: string
  email: string
  avatar: string
  locale?: string
  city?: string
  country?: string
  wechat: string
  updated: number
  roles: [string]
  verification?: string
  contacts: [Schema.Types.ObjectId]
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
  points: number
  level?: number
  balance: number

  viewCount: number
  
  // document status
  isNew: boolean
  wasNew: boolean

  // methods
  comparePassword: Function
  addToList: Function
  removeFromList: Function
  addToBalance: Function
  loggedIn: Function
}