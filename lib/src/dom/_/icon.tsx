import * as React from 'react'

import { Glyph } from '../components'
import { IGlyphProps } from '../interfaces'

export interface IBadgeProps {
  text?: string | number
  backgroundColor?: string
}

export interface IIconProps {
  title: string
  id?: string
  type?: string
  glyph?: IGlyphProps
  badge?: IBadgeProps
  iconStyle?: any
  labelStyle?: any
  badgeStyle?: any
  selected?: boolean | string
  onPress?: Function
}

export const IconDOM: React.StatelessComponent<IIconProps> = (props) => {
  let {id, type, selected, title, iconStyle, labelStyle, badgeStyle} = props,
    badge = null

  if (props.badge !== undefined) {
    badgeStyle = badgeStyle || {}
    badgeStyle.backgroundColor = props.badge.backgroundColor || null
    badge = <span className="singular-icon-badge" style={badgeStyle}>{props.badge.text.toString()}</span>
  }
  
  return (
    <span className="singular-icon" data-type={type} data-selected={selected} id={id} style={iconStyle} onClick={() => props.onPress()}>
      <Glyph {...props.glyph} />
      <span className="singular-icon-title" style={labelStyle}>{title}</span>
      { badge }
    </span>
  )
}
