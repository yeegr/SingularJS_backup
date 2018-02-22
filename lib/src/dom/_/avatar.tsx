import * as React from 'react'

export interface IAvatarProps {
  url: string
  type?: string
  size?: string
}

export const AvatarDOM: React.StatelessComponent<IAvatarProps> = (props) => {
  let type = 'circle',
    size = 'm',
    style = {
      backgroundImage: `url(${props.url})`
    }

  switch (props.type) {
    case 'circle':
    case 'square':
    case 'rounded':
      type = props.type
    break
  }

  switch (props.size) {
    case 'xxs':
    case 'xs':
    case 's':
    case 'm':
    case 'l':
    case 'xl':
    case 'xxl':
      size = props.size
    break
  }


  return (
    <div className="singular-avatar" data-type={type} data-size={size} style={style}></div>
  )
}
