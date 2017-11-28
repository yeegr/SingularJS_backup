import { Document, Schema } from 'mongoose'

export default interface IPhoto extends Document {
  url: string
  desc?: string
}