import * as React from 'react'

import { TabView, Panel, NavBar } from '../lib/components'

class TabTest extends React.Component {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      // <TabView
      //   type="icon"
      //   items={[{
      //     title: "新闻",
      //     glyph: {
      //       type: "square",
      //       name: "phone",
      //       badge: {
      //         text: "9"
      //       }
      //     },
      //     content: (
      //       <div className="singular-page">
      //         <Navbar 
      //           title="轨迹"
      //           nav={{glyph: {name: 'calendar'}, title: "previous"}}
      //         />
      //         <div className="singular-page-content">
      //           <TabView
      //             type="text"
      //             items={[{
      //               title: "要闻",
      //               content: (
      //                 <div></div>
      //               )
      //             }, {
      //               title: "国际",
      //               content: (
      //                 <div></div>
      //               )
      //             }, {
      //               title: "本地",
      //               content: (
      //                 <div></div>
      //               )
      //             }, {
      //               title: "娱乐",
      //               content: (
      //                 <div></div>
      //               )
      //             }]}
      //           />
      //         </div>
      //       </div>
      //     )
      //   }, {
      //     title: "产品",
      //     glyph: {
      //       name: "calendar"
      //     }
      //   }, {
      //     title: "活动",
      //     glyph: {
      //       name: "clock"
      //     }
      //   }]}
      // />
      <TabView type="icon">
        <Panel title="新闻" glyph={{type: "square", name: "phone", badge: {text: "9"}}}>
          <div className="singular-page">
            <NavBar 
              title="轨迹"
              nav={{glyph: {name: 'calendar'}, title: "previous"}}
            />
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
        </Panel>
        <Panel title="活动" glyph={{name: "calendar"}}>
          <div className="singular-page">
            <NavBar 
              title="活动"
              nav={{glyph: {name: 'calendar'}, title: "previous"}}
            />
          </div>
        </Panel>
        <Panel title="轨迹" glyph={{name: "clock"}}>
          <div className="singular-page">
            <NavBar 
              title="轨迹"
              nav={{glyph: {name: 'calendar'}, title: "previous"}}
            />
          </div>
        </Panel>
      </TabView>
    )
  }
}

export default TabTest
