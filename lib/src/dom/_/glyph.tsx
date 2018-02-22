import * as React from 'react'

import * as MATERIAL from '../styles/material/glyphs'

export interface IGlyphProps {
  name?: string
  design?: string
  viewBox?: string
  box?: string
  style?: any
  path?: string
}

export const GlyphDOM: React.StatelessComponent<IGlyphProps> = (props) => {
  const DESIGN = MATERIAL

  let viewBox = props.viewBox || DESIGN.DEFAULT_VIEW_BOX,
    d = props.path || DESIGN.GLYPHS[props.name]

  return (
    <span className="singular-glyph" style={props.style} data-box={props.box}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox={viewBox}>
        <path d={d} />
      </svg>
    </span>
  )
}
