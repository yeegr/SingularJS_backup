import { Document, Schema } from 'mongoose'

export default interface IJob extends Document {
  rating?: number
  diff?: number
  content: string

  wasNew: boolean
}