import {
  Document,
  Schema
} from 'mongoose'

export default interface IPost extends Document {
  _id: Schema.Types.ObjectId
  author: Schema.Types.ObjectId
  title: string
  slug: string
  content: string
  excerpt: string
  hero: string
  tags: [string],
  status: string
  updated: number
  publish: number
  viewCount: number
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
  addView: Function
  addToList: Function
  removeFromList: Function
}