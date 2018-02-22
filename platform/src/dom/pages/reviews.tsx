import * as React from 'react'
import MediaQuery from 'react-responsive'

import { App } from '../components/app'
import { LANG, NavBar, Icon, SplitView, SplitParent, SplitChild } from '../modules'

class Reviews extends React.Component {
  constructor(props: any) {
    super(props)
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
                  nav={{glyph: {name: 'menu'}, title: LANG.t('base:navigation.Menu')}}
                >
                  <Icon glyph={{name: 'search'}} title="" />
                </NavBar>
                <div>
                  this is the parent {}
                </div>
              </SplitParent>
              <SplitChild>
                <NavBar 
                  title={LANG.t('sidebar.Reviews')}
                  nav={{glyph: {name: 'back'}, title: LANG.t('base:navigation.Back'), onPress: () => history.back()}}
                >
                  <Icon glyph={{name: 'add'}} title="" />
                </NavBar>
                <div>
                  this is the child
                </div>
              </SplitChild>
            </SplitView>
          </div>
        </div>
      </App>
    )
  }
}

export default Reviews