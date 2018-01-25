import * as React from 'react'

import * as MATERIAL from '../styles/material/glyphs'

export interface IBadgeProps {
  text?: string | number
  backgroundColor?: string
}

export interface IGlyphProps {
  name?: string
  type?: string
  design?: string
  style?: any
  viewBox?: string
  path?: string
  badge?: IBadgeProps
}

export const GlyphDOM: React.StatelessComponent<IGlyphProps> = (props) => {
  const DESIGN = MATERIAL

  let className = 'singular-glyph ',
    viewBox = props.viewBox || DESIGN.DEFAULT_VIEW_BOX,
    d = props.path || DESIGN.GLYPHS[props.name],
    badge = null

  switch (props.type) {
    case 'ring':
    case 'circle':
    case 'square':
    case 'rounded':
      className += 'singular-glyph-' + props.type
    break
  }  
  
  if (props.badge !== undefined) {
    let badgeStyle = {
      backgroundColor: props.badge.backgroundColor
    }

    badge = <span className="singular-icon-badge" style={badgeStyle}>{props.badge.text}</span>
  }

  return (
    <span className={className} style={props.style}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox={viewBox}>
        <path d={d} />
      </svg>
      {badge}
    </span>
  )
}
