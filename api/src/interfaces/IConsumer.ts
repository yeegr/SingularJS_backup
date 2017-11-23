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
  type: string
  roles: [string]
  status: string
  verified?: Schema.Types.ObjectId
  expires?: number
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

  totalViews: number
  
  // document status
  isNew: boolean
  wasNew: boolean

  // methods
  addToArray: Function
  removeFromArray: Function
  addToList: Function
  removeFromList: Function
  addToBalance: Function
  comparePassword: Function
}