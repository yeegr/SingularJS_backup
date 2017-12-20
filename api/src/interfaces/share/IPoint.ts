import { Document } from 'mongoose'

export default interface IPoint extends Document {
  lat: number
  lng: number
  alt?: number
  name?: string
  address?: string
  city?: string
  country?: string
}