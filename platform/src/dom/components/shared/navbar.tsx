import * as React from 'react'

import * as Material from './material'
import Icon, { IIconProps } from './icon'

interface INavBarProps {
  title: string
  nav?: IIconProps
  tools?: IIconProps[]
}

const NavBarDOM: React.SFC<INavBarProps> = (props) => {
  let nav = null,
    tools: any[] = [] 

  if (props.nav) {
    nav = <Icon {...props.nav} />
  }

  if (props.tools && props.tools.length > 0) {
    props.tools.forEach((t: IIconProps) => {
      tools.push(<Icon {...t} />)
    })
  }

  return (
    <div className="singular-nav-bar">
      <div className="singular-nav-prev">
        {nav}
      </div>
      <div className="singular-nav-title">
        {props.title}
      </div>
      <div className="singular-nav-toolbar">
        {tools}
      </div>
    </div>
  )
}

export default NavBarDOM
