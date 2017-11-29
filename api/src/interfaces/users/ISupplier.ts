import { Schema } from 'mongoose'
import IUser from './IUser'

export default interface IPlatform extends IUser {
  username: string
  pid: string
  viewCount: number

  // virtual fields
}