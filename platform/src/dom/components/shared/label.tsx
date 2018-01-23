import * as React from 'react'

import * as Material from './material'

import Glyph, { IGlyphProps } from './glyph'

interface ILabelProps {
  glyph?: IGlyphProps
  text: string
  tl?: boolean
  hl?: boolean
  size?: string
  selected?: boolean | string
}

const LabelDOM: React.SFC<ILabelProps> = (props) => {
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

export default LabelDOM
