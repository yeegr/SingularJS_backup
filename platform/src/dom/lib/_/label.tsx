import * as React from 'react'

import { GlyphDOM as Glyph, IGlyphProps } from './glyph'

export interface ILabelProps {
  glyph?: IGlyphProps
  text: string
  tl?: boolean
  hl?: boolean
  size?: string
  selected?: boolean | string
}

export const LabelDOM: React.SFC<ILabelProps> = (props) => {
  let className = '',
    tl = props.tl || null,
    hl = props.hl || null,
    size = props.size || null,
    glyph = <Glyph {...props.glyph} />

  return (
    <span className="singular-label" data-selected={props.selected} data-tl={tl} data-hl={hl} data-size={size}>
      { glyph }
      <span className="singular-label-text">{props.text}</span>
    </span>
  )
}
