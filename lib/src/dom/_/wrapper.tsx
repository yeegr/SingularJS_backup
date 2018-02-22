import * as React from 'react'

export interface IWrapperProps {
}

export const WrapperDOM: React.StatelessComponent<IWrapperProps> = (props) => {
  return (
    <div className="singular-app">
      { props.children }
    </div>
  )
}
