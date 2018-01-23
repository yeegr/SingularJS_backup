import * as React from 'react'

import Glyph from './shared/glyph'
import Icon from './shared/icon'
import Label from './shared/label'
import Avatar from './shared/avatar'

class Hello extends React.Component {
  constructor(props: any) {
    super(props)
  }


  render() {
    return (
      <div>
        <div className="singular-grid" data-col="5">
          
        <Icon glyph={{name: "destination", badge: {text: ""}}} title="destination" type="square" />
        <Icon glyph={{name: "destination", badge: {text: "new"}}} title="destination" type="square" />
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        </div>
        <div>
          <Label glyph={{name: "next"}} text="next" />
        </div>
        <div>
        </div>
        <div>
        <Avatar url="" size="xxl" />
        <Avatar url="" size="xl" />
        <Avatar url="" size="l" />
        <Avatar url="" size="m" />
        <Avatar url="" size="s" />
        <Avatar url="" size="xs" />
        <Avatar url="" size="xxs" />
        </div>
      </div>
    )
  }
}

export default Hello