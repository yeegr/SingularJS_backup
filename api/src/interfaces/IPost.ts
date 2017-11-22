import {
  Document,
  Schema
} from 'mongoose'

export default interface IPost extends Document {
  _id: Schema.Types.ObjectId
  creator: Schema.Types.ObjectId
  title: string
  slug: string
  content: string
  excerpt: string
  hero: string
  tags: [string],
  status: string
  updated: number
  publish?: number
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
  addComment: Function
  removeComment: Function
}