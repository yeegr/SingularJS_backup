import * as React from 'react'

import { IconDOM as Icon, IIconProps } from './icon'

export interface INavBarProps {
  title: string
  nav?: IIconProps
  tools?: IIconProps[]
}

export const NavBarDOM: React.StatelessComponent<INavBarProps> = (props) => {
  let nav = null,
    tools: any[] = [] 

  if (props.nav) {
    nav = <Icon {...props.nav} />
  }

  return (
    <div className="singular-nav-bar">
      <div className="singular-nav-prev">
        { nav }
      </div>
      <div className="singular-nav-title">
        { props.title }
      </div>
      <div className="singular-nav-toolbar">
        { props.children }
      </div>
    </div>
  )
}
