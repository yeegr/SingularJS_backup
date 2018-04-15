import * as ACTIONS from '../constants/homeConstants'

export interface IHomeActions {
  showSidebar: Function
  hideSidebar: Function
  toggleSidebar: Function

  showSearchPane: Function
  hideSearchPane: Function
  toggleSearchPane: Function
}

export const showSidebar = () => {
  return {
    type: ACTIONS.SHOW_SIDEBAR
  }
}
export const hideSidebar = () => {
  return {
    type: ACTIONS.HIDE_SIDEBAR
  }
}

export const toggleSidebar = () => {
  return {
    type: ACTIONS.TOGGLE_SIDEBAR
  }
}


export const showSearchPane = () => {
  return {
    type: ACTIONS.SHOW_SEARCH_PANE
  }
}

export const hideSearchPane = () => {
  return {
    type: ACTIONS.HIDE_SEARCH_PANE
  }
}

export const toggleSearchPane = () => {
  return {
    type: ACTIONS.TOGGLE_SEARCH_PANE
  }
}