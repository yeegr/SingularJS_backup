import * as React from 'react'
import MediaQuery from 'react-responsive'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { toggleSidebar, showSearchPane } from '../../redux/actions/homeActions'

import { LANG, SERVERS, SETTINGS } from '../../common'
import { NavBar, Icon, SplitView, SplitParent, SplitChild } from '../modules'
import App from '../components/app'

import * as logsActions from '../../redux/actions/logsActions'

interface IProps {
  home: {
    sidebarHidden: boolean
  }
  toggleSidebar: Function
  showSearchPane: Function

  logsActions: {
    listItems: Function
  }
}

interface IState {
}

class Reviews extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
  }

  componentWillMount() {
    console.log(SERVERS)
    this.props.logsActions.listItems()
    // this.props.userActions.listItems()
  }

  render() {
    return (
      <App>
        <div className="singular-page">
          <div className="singular-page-content">
            <SplitView>
              <SplitParent>
                <NavBar 
                  title={LANG.t('sidebar.Reviews')}
                  prev={{glyph: {name: 'menu'}, title: LANG.t('base:navigation.Menu'), onPress: this.props.toggleSidebar}}
                >
                  <Icon glyph={{name: 'search'}} title="" onPress={this.props.showSearchPane} />
                </NavBar>
                <div>
                  this is the parent {}
                </div>
              </SplitParent>
              <SplitChild>
                <NavBar 
                  title={LANG.t('sidebar.Reviews')}
                  prev={{glyph: {name: 'back'}, title: LANG.t('base:navigation.Back'), onPress: () => history.back()}}
                >
                  <Icon glyph={{name: 'edit'}} title="" />
                </NavBar>
                <div>
                  this is the child 2
                </div>
              </SplitChild>
            </SplitView>
          </div>
        </div>
      </App>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    home: state.home,
    logs: state.logs
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    toggleSidebar: bindActionCreators(toggleSidebar, dispatch),
    showSearchPane: bindActionCreators(showSearchPane, dispatch),
    logsActions: bindActionCreators(logsActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reviews)
