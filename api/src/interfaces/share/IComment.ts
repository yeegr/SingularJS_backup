import IAction from '../actions/IAction'

export default interface IComment extends IAction {
  rating?: number
  diff?: number
  content: string

  wasNew: boolean
}