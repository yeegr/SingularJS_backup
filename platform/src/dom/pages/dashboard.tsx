import * as React from 'react'

import { App } from '../components/app'
import { LANG, NavBar } from '../modules'

class Dashboard extends React.Component {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <App>
        <div className="singular-page">
            <NavBar 
            title={LANG.t('sidebar.Dashboard')}
            nav={{glyph: {name: 'menu'}, title: 'menu'}}
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

export default Dashboard