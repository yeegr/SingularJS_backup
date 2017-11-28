import IAction from './IAction'

export default interface IComment extends IAction {
  rating?: number
  diff?: number
  content: string

  wasNew: boolean
}