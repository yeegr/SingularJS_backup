import * as React from 'react'

import { LANG } from '../../common'
import { NavBar, TabView, Panel } from '../modules'

export class NewsComponent extends React.PureComponent {
  constructor(props: any) {
    super (props)
  }

  render() {
    return (
      <div className="singular-page">
        <NavBar 
          title="轨迹"
          prev={{glyph: {name: 'calendar'}, title: "previous"}}
        >
        </NavBar>
        <TabView type="text">
          <Panel title="International">
            <div>国际</div>
          </Panel>
          <Panel title="Domestic">
            <div>国内</div>
          </Panel>
          <Panel title="Entertainment">
            <div>娱乐</div>
          </Panel>
          <Panel title="Technology">
            <div>科技</div>
          </Panel>
          <Panel title="Sports">
            <div>体育</div>
          </Panel>
          <Panel title="Science">
            <div>科学</div>
          </Panel>
          <Panel title="Society">
            <div>社会</div>
          </Panel>
          <Panel title="Automobile">
            <div>汽车</div>
          </Panel>
        </TabView>
      </div>
    )
  }
}
