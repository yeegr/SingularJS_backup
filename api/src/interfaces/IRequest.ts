import { Request } from 'express'

export default interface IRequest extends Request {
  ref: {
    type: string
    data: any
  }
}