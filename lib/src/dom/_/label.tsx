import * as React from 'react'

import { GlyphDOM as Glyph, IGlyphProps } from './glyph'

export interface ILabelProps {
  glyph?: IGlyphProps
  text: string
  flow?: string
  highlite?: boolean
  size?: string
  selected?: boolean | string
  onClick?: Function
}

export const LabelDOM: React.StatelessComponent<ILabelProps> = (props) => {
  let className = '',
    flow = props.flow || null,
    highlite = props.highlite || null,
    size = props.size || null,
    glyph = <Glyph {...props.glyph} />

  return (
    <span className="singular-label" data-selected={props.selected} data-flow={flow} data-highlite={highlite} data-size={size} onClick={() => props.onClick()}>
      { glyph }
      <span className="singular-label-text">{props.text}</span>
    </span>
  )
}
