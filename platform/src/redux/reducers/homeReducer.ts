import * as ACTIONS from '../constants/homeConstants'

export interface IHome {
  sidebarHidden: boolean
  searchPaneHidden: boolean
}

const homeReducer = (state: IHome = {
  sidebarHidden: false,
  searchPaneHidden: true
}, action: any) => {
  switch (action.type) {
    case ACTIONS.SHOW_SIDEBAR:
      return (<any>Object).assign({}, state, {
        sidebarHidden: false
      })

    case ACTIONS.HIDE_SIDEBAR:
      return (<any>Object).assign({}, state, {
        sidebarHidden: true
      })

    case ACTIONS.TOGGLE_SIDEBAR:
      return (<any>Object).assign({}, state, {
        sidebarHidden: !state.sidebarHidden
      })

    case ACTIONS.SHOW_SEARCH_PANE:
      return (<any>Object).assign({}, state, {
        searchPaneHidden: false
      })

    case ACTIONS.HIDE_SEARCH_PANE:
      return (<any>Object).assign({}, state, {
        searchPaneHidden: true
      })

    case ACTIONS.TOGGLE_SEARCH_PANE:
      return (<any>Object).assign({}, state, {
        searchPaneHidden: !state.searchPaneHidden
      })

    default:
      return state
  }
}

export default homeReducer
