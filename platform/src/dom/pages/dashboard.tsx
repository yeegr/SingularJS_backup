import * as React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { toggleSidebar } from '../../redux/actions/homeActions'

import { LANG } from '../../common'
import { NavBar } from '../modules'
import App from '../components/app'

interface IProps {
  toggleSidebar: Function
}

class Dashboard extends React.Component<IProps> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <App>
        <div className="singular-page">
          <NavBar 
            title={LANG.t('sidebar.Dashboard')}
            prev={{glyph: {name: 'menu'}, title: LANG.t('base:navigation.Menu'), onPress: this.props.toggleSidebar}}
          />
          <div className="singular-page-content">
            <div className="singular-dashboard">
              <div className="singular-dashboard-box" data-type="wide">
                this is box 1
              </div>
              <div className="singular-dashboard-box">
                this is box 2
              </div>
              <div className="singular-dashboard-box">
                this is box 3
              </div>
              <div className="singular-dashboard-box">
                this is box 4
              </div>
              <div className="singular-dashboard-box">
                this is box 5
              </div>
              <div className="singular-dashboard-box">
                this is box 6
              </div>
              <div className="singular-dashboard-box">
                this is box 7
              </div>
              <div className="singular-dashboard-box">
                this is box 8
              </div>
            </div>
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
    toggleSidebar: bindActionCreators(toggleSidebar, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
