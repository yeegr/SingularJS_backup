import * as React from 'react'

import { IconDOM as Icon, IIconProps } from './icon'

export interface INavBarProps {
  title: string
  prev?: IIconProps
  tools?: IIconProps[]
}

export const NavBarDOM: React.StatelessComponent<INavBarProps> = (props) => {
  let prev = null,
    tools: any[] = [] 

  if (props.prev) {
    prev = <Icon {...props.prev} />
  }

  return (
    <div className="singular-nav-bar">
      <div className="singular-nav-prev">
        { prev }
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
