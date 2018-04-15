import * as React from 'react'
import { NavLink } from 'react-router-dom'
import MediaQuery from 'react-responsive'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { IHome } from '../../redux/reducers/homeReducer'
import { ILogin } from '../../redux/reducers/loginReducer'
import { hideSidebar } from '../../redux/actions/homeActions'
import * as loginActions from '../../redux/actions/loginActions'
import { ILoginActions } from '../../redux/actions/loginActions'

import { CONST, LANG, SERVERS, SETTINGS } from '../../common'
import { Wrapper, TabView, Panel, SideView, SearchView, SideBar, SidePane, NavBar, Icon } from '../modules'

import Login from './Login'

interface IProps {
  home: IHome
  login: ILogin
  hideSidebar: Function
  loginActions: ILoginActions
}

interface IState {
  sidebarHidden: boolean
  searchPaneHidden: boolean
}

class App extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props)

    this.state = {
      sidebarHidden: this.props.home.sidebarHidden,
      searchPaneHidden: this.props.home.searchPaneHidden
    }
  }

  componentWillMount() {
    SETTINGS.storageEngine = localStorage
    SETTINGS.storageType = CONST.STORAGE_TYPE.LOCAL
    
    this.props.loginActions.isLoggedIn()
  }

  componentWillReceiveProps(nextProps: IProps) {
    this.setState({
      sidebarHidden: nextProps.home.sidebarHidden,
      searchPaneHidden: nextProps.home.searchPaneHidden
    })
  }

  render() {
    const appView: JSX.Element = (
      <Wrapper>
        <SideView>
          <SideBar textLogo={'SingularJS'} hidden={this.state.sidebarHidden} close={this.props.hideSidebar}>
            <NavLink activeClassName="singular-sidebar-navlink-active" exact to="/">
              <Icon title={LANG.t('sidebar.Dashboard')} glyph={{name: 'dashboard'}} />
            </NavLink>
            <div className="singular-sidebar-section">
              <div className="singular-sidebar-section-header">{LANG.t('tab.Tasks')}</div>
              <NavLink activeClassName="singular-sidebar-navlink-active" to="/tasks/reviews">
                <Icon title={LANG.t('sidebar.Reviews')} glyph={{name: 'reviews'}} />
              </NavLink>
              <NavLink activeClassName="singular-sidebar-navlink-active" to="/tasks/notifications">
                <Icon title={LANG.t('sidebar.Notifications')} glyph={{name: 'notifications'}} />
              </NavLink>
              <NavLink activeClassName="singular-sidebar-navlink-active" to="/tasks/feedbacks">
                <Icon title={LANG.t('sidebar.Feedbacks')} glyph={{name: 'feedbacks'}} />
              </NavLink>
            </div>
            <div className="singular-sidebar-section">
              <div className="singular-sidebar-section-header">{LANG.t('tab.Stats')}</div>
              <NavLink activeClassName="singular-sidebar-navlink-active" to="/stats/trending">
                <Icon title={LANG.t('sidebar.Trending')} glyph={{name: 'trending'}} />
              </NavLink>
              <NavLink activeClassName="singular-sidebar-navlink-active" to="/stats/servers">
                <Icon title={LANG.t('sidebar.Servers')} glyph={{name: 'servers'}} />
              </NavLink>
            </div>
            <div className="singular-sidebar-section">
              <div className="singular-sidebar-section-header">{LANG.t('tab.System')}</div>
              <NavLink activeClassName="singular-sidebar-navlink-active" to="/system/config">
                <Icon title={LANG.t('sidebar.Configurations')} glyph={{name: 'config'}} />
              </NavLink>
            </div>
            <div className="singular-sidebar-section">
              <NavLink activeClassName="singular-sidebar-navlink-active" to="/self">
                <Icon title={LANG.t('sidebar.Account')} glyph={{name: 'account'}} />
              </NavLink>
            </div>
          </SideBar>
          <SidePane>
            { this.props.children }
          </SidePane>
        </SideView>
        <SearchView hidden={this.props.home.searchPaneHidden}>
          <Icon title={LANG.t('base:toggle.close')} glyph={{name: 'close'}} onPress={this.props.hideSearchPane} />
        </SearchView>
      </Wrapper>
    )

    return (this.props.login.user) ? (
      appView
    ) : (
      <Login />
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    home: state.home,
    login: state.login
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    hideSidebar: bindActionCreators(hideSidebar, dispatch),
    loginActions: bindActionCreators(loginActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
