import { Schema } from 'mongoose'
import ILog from './ILog'

export default interface IConsumer extends ILog {
  status: number
  code?: string
  key?: string
  message?: string
}