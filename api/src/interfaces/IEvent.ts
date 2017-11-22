import {
  Document,
  Schema
} from 'mongoose'

export default interface IEvent extends Document {
  _id: Schema.Types.ObjectId
  creator: Schema.Types.ObjectId
  ref: string
  title: string
  slug: string
  description: string
  excerpt: string
  hero: string
  maxAttendee: number
  minAttendee: number
  tags: [string],
  status: string
  updated: number
  publish: number
  totalViews: number
  totalRating: number,
  comments: [Schema.Types.ObjectId]
  likes: [Schema.Types.ObjectId]
  dislikes: [Schema.Types.ObjectId]
  saves: [Schema.Types.ObjectId]
  shares: [Schema.Types.ObjectId]

  // virtual fields
  averageRating: number
  
  // document status
  isNew: boolean
  wasNew: boolean

  // methods
  addToList: Function
  removeFromList: Function
}