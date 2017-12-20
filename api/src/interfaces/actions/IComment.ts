import { Schema } from 'mongoose'
import IAction from './IAction'

export default interface IComment extends IAction {
  parent?: Schema.Types.ObjectId
  rating?: number
  diff?: number
  content: string
}