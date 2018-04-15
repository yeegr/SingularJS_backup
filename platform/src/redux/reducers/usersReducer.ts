import { Reducer, combineReducers } from 'redux'
import { listReducer, IList } from './_listReducer'
import { getReducer, IItem } from './_getReducer'

const prefix: string = 'USER'

interface State {
  list: IList
  item: IItem
}

const logReducer: Reducer<State> = combineReducers({
  list: listReducer(prefix),
  item: getReducer(prefix)
})

export default logReducer
