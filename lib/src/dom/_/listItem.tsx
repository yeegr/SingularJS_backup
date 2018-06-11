import * as React from 'react'
import { Link } from 'react-router-dom'

import { GlyphDOM as Glyph, IGlyphProps } from './glyph'

export interface IListItemProps {
  to?: string
  glyph?: IGlyphProps
  title?: string
  heading?: string
  subtitle?: string
  isNew?: boolean
  badge?: {
    value: string | number
    color?: string
    backgroundColor?: string
  }
  showChevron?: boolean
}

export const ListItemDOM: React.StatelessComponent<IListItemProps> = (props) => {
  let glyph = (props.glyph) ? (
      <span className="singular-list-item-glyph">
        <Glyph {...props.glyph} />
      </span>
    ) : null,
    title = (props.title && props.title.length > 0) ? (
      <span className="singular-list-item-title">
        { props.title }
      </span>
    ) : null,
    heading = (props.heading && props.heading.length > 0) ? (
      <span className="singular-list-item-heading">
        { props.heading }
      </span>
    ) : null,
    subtitle = (props.subtitle && props.subtitle.length > 0) ? (
      <span className="singular-list-item-subtitle">
        { props.subtitle }
      </span>
    ) : null,
    chevron = (props.showChevron) ? (
      <span className="singular-list-item-next">
        <Glyph name="next" />
      </span>
    ) : null,
    value = null

  if (props.badge) {
    let badgeStyle = {
      color: props.badge.color || null,
      'background-color': props.badge.backgroundColor || null
    }

    value = (
      <span className="singular-list-item-badge" style={badgeStyle}>
        { props.badge.value }
      </span>
    )
  }

  let content = (
      <div className="singular-list-item" aria-new={props.isNew}>
        { glyph }
        <div className="singular-list-item-desc">
          { heading }
          { title }
          { subtitle }
        </div>
        <div className="singular-list-item-pointer">
          { value }
          { chevron }
        </div>
      </div>
    ),
    link = (props.to && props.to.length > 0) ? (
      <Link to={props.to}>
        { content }
      </Link>
    ) : content

  return (
    <li className="singular-li">
      { link }
    </li>
  )
}
