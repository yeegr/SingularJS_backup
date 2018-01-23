import * as React from 'react'

import * as Material from './material'

export interface BadgeProps {
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
  badge?: BadgeProps
}

const GlyphDOM: React.SFC<IGlyphProps> = (props) => {
  const Design = Material

  let className = 'singular-glyph ',
    viewBox = props.viewBox || Design.DEFAULT_VIEW_BOX,
    d = props.path || Design.GLYPHS[props.name],
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

export default GlyphDOM
