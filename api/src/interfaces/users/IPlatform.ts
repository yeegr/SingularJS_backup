import { Schema } from 'mongoose'
import IUser from './IUser'

export default interface IPlatform extends IUser {
  username: string
  nickname: string
  pid: string
  jobCount: number

  // virtual fields
  jobs: Schema.Types.ObjectId[]
}