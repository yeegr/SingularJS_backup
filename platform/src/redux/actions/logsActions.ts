import * as readActions from './_readActions'
import { SERVERS } from '../../common'

const prefix: string = 'LOGS'
const endpoint: string = SERVERS.API_SERVER + 'helpers/logs/'

export const listItems = () => {
  return readActions.listItems(prefix, endpoint)
}

export const getItem = (id: string) => {
  return readActions.getItem(prefix, endpoint + id)
}