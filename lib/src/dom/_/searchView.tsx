import * as React from 'react'
import { Link } from 'react-router-dom'

interface ISearchViewProps {
  hidden: boolean
}

interface ISearchViewState {

}

export class SearchViewDOM extends React.PureComponent<ISearchViewProps, ISearchViewState> {
  constructor(props: ISearchViewProps) {
    super(props)
  }

  render() {
    return (
      <div className="singular-search-view" aria-hidden={this.props.hidden}>
        { this.props.children }
      </div>
    )
  }
}