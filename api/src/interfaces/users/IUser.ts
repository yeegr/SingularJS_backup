import { Document, Schema } from 'mongoose'

export default interface IConsumer extends Document {
  [key: string]: any
  _id: Schema.Types.ObjectId
  ref: string
  password: string
  name: string
  gender?: number
  mobile: string
  email: string
  avatar: string
  locale?: string
  city?: string
  country?: string
  updated: number
  roles: string[]
  status: string
  verified?: Schema.Types.ObjectId
  
  // virtual fields
  comments: Schema.Types.ObjectId[]

  // document status
  isNew: boolean
  wasNew: boolean

  // methods
  comparePassword: Function
}