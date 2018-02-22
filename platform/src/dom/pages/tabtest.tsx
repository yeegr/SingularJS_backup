import * as React from 'react'
import { NavLink } from 'react-router-dom'
import MediaQuery from 'react-responsive'

import { LANG } from '../modules'
import { Wrapper, TabView, Panel, SideView, SideBar, SidePane, NavBar, Icon } from '../modules'


import { NewsComponent }  from '../components/news'


class TabTest extends React.PureComponent {
  constructor(props: any) {
    super(props)
  }

  render() {
    let selectedTabIndex = 3

    return (
      <Wrapper>
        <MediaQuery query='(orientation: portrait)'>
          <TabView type='icon' selectedIndex={3}>
            <Panel title={LANG.t('tab.Dashboard')} glyph={{name: 'dashboard'}}>
              <NewsComponent />
            </Panel>
            <Panel title={LANG.t('tab.Tasks')} glyph={{name: 'tasks'}}>
              <NewsComponent />
            </Panel>
            <Panel title={LANG.t('tab.Stats')} glyph={{name: 'stats'}}>
              <NewsComponent />
            </Panel>
            <Panel title={LANG.t('tab.System')} glyph={{name: 'system'}}>
              <NewsComponent />
            </Panel>
            <Panel title={LANG.t('tab.Account')} glyph={{name: 'account'}}>
              <NewsComponent />
            </Panel>
          </TabView>
        </MediaQuery>

        <MediaQuery query='(orientation: landscape)'>
          <SideView>
            <SideBar>
              <NavLink activeClassName="singular-sidebar-navlink-active" to="/tab">
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
                <NavLink activeClassName="singular-sidebar-navlink-active" to="/account">
                  <Icon title={LANG.t('sidebar.Account')} glyph={{name: 'account'}} />
                </NavLink>
              </div>
            </SideBar>
            <SidePane>
            </SidePane>
          </SideView>
        </MediaQuery>
      </Wrapper>
    )
  }
}

export default TabTest
