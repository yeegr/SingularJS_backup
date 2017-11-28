import { Document, Schema } from 'mongoose'

import IPoint from './IPoint'

export default interface ISubset extends Document {
  title?: string
  misc?: string
  startDate: number
  deadline?: number
  rallyPoint?: IPoint
  rallyTime?: number
  status?: string
}