import * as React from 'react'

import { GlyphDOM as Glyph, IGlyphProps } from './glyph'

export interface IIconProps {
  title: string
  id?: string
  type?: string
  glyph?: IGlyphProps
  iconStyle?: any
  textStyle?: any
  selected?: boolean | string
  onPress?: Function
}

export class IconDOM extends React.PureComponent<IIconProps> {
  constructor(props: IIconProps) {
    super(props)
  }

  render() {
    let props: any = this.props,
      iconStyle: any = props.iconStyle || null,
      textStyle: any = props.textStyle || null,
      className = ''

    return (
      <span className="singular-icon" id={props.id} data-selected={props.selected} onClick={() => props.onPress()} style={iconStyle}>
        <Glyph {...props.glyph} />
        <span className="singular-icon-title" style={textStyle}>{props.title}</span>
      </span>
    )
  }
}
