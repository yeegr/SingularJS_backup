import * as React from 'react'

export interface ISplitViewProps {
  selectedIndex?: number
}

export interface ISplitViewState {
  selectedIndex: number
}

export interface ISplitParentProps {
}

export interface ISplitParentState {
}

export interface ISplitChildProps {
}

export class SplitParentDOM extends React.PureComponent<ISplitParentProps, ISplitParentState> {
  constructor(props: ISplitParentProps) {
    super(props)
  }

  render() {
    return (
      <aside className="singular-split-parent">
        { this.props.children }
      </aside>
    )
  }
}

export const SplitChildDOM: React.StatelessComponent<ISplitChildProps> = (props) => {
  return (
    <div className="singular-split-child">
      { props.children }
    </div>
  )
}

export class SplitViewDOM extends React.PureComponent<ISplitViewProps, ISplitViewState> {
  constructor(props: ISplitViewProps) {
    super(props)

    this.state = {
      selectedIndex: this.props.selectedIndex || 0
    }
  }

  selectedTag(selectedIndex: number) {
    this.setState({selectedIndex})
  }

  render() {
    return (
      <div className="singular-split-view">
        { this.props.children }
      </div>
    )
  }
}
