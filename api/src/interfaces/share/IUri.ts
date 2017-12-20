import { Document } from 'mongoose'

export default interface IUri extends Document {
  url: string
  thumb: string
  title: string
  excerpt?: string
}