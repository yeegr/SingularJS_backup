import { Schema } from 'mongoose'
import ILog from './ILog'

export default interface IConsumer extends ILog {
  slug?: string
  status: number
  code?: string
  key?: string
  message?: string
}