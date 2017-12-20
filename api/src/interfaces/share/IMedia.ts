import { Document } from 'mongoose'

export default interface IMedia extends Document {
  path: string
  thumb: string
  desc?: string
}