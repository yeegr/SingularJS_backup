import { Schema } from 'mongoose'
import IContent from '../share/IContent'

import IAgenda from './IAgenda'
import IAttendee from './IAttendee'
import ISubset from './ISubset'
import IMedia from '../share/IMedia'
import IPoint from '../share/IPoint'

export default interface IEvent extends IContent {
  isPublic: boolean
  requireApproval: boolean
  misc?: [{
    key: string
    value: string
  }]
  destination?: string
  gallery: IMedia[]
  notes: string[]
  gears: Schema.Types.Mixed[]
  city?: string
  country?: string
  maxAttendee: number
  minAttendee: number
  expenses: {
    deposit?: number
    perHead?: number
    insurance?: number
    detail?: string[]
    includes?: string[]
    excludes?: string[]
  }
  contacts: [{
    handle: string
    mobile?: string
    email?: string
  }]
  schedule: IAgenda[]
  subsets: ISubset[]
}