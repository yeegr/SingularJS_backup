import { Document, Schema } from 'mongoose'

export default interface IPlatform extends Document {
  [key: string]: any
  _id: Schema.Types.ObjectId
  ref: string
  username: string
  password: string
  handle: string
  name: string
  gender?: number
  mobile: string
  email: string
  pid: string
  avatar: string
  locale: string
  city: string
  country: string
  updated: number
  roles: string[]
  status: string
  jobCount: number

  // virtual fields
  jobs: [Schema.Types.ObjectId]

  // document status
  isNew: boolean
  wasNew: boolean

  // methods
  comparePassword: Function
}