import { Document, Schema } from 'mongoose'

export default interface IConsumer extends Document {
  [key: string]: any
  _id: Schema.Types.ObjectId
  ref: string
  handle: string
  password: string
  name: string
  gender?: number
  pid?: string
  mobile: string
  email: string
  avatar: string
  background?: string
  locale?: string
  city?: string
  country?: string
  updated: number
  roles: string[]
  status: string
  verified?: Schema.Types.ObjectId
  expires: number
  
  // virtual fields
  comments: Schema.Types.ObjectId[]

  // document status
  isNew: boolean
  wasNew: boolean

  // methods
  comparePassword: Function
}