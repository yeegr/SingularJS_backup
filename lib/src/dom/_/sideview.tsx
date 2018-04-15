import * as React from 'react'
import { Link } from 'react-router-dom'

import { Glyph, Icon, Label } from '../components'

export interface ISideViewProps {
  selectedIndex?: number
}

export interface ISideViewState {
  selectedIndex: number
}

export interface ISideBarProps {
  hidden?: boolean
  expanded?: boolean
  showLogo?: boolean
  textLogo?: string
  close?: Function
}

export interface ISideBarState {
  hidden: boolean
  expanded: boolean
  showLogo: boolean
}

export interface ISidePaneProps {
}

export class SideBarDOM extends React.PureComponent<ISideBarProps, ISideBarState> {
  constructor(props: ISideBarProps) {
    super(props)

    this.state = {
      hidden: this.props.hidden || false,
      expanded: this.props.expanded || false,
      showLogo: this.props.showLogo || true
    }

    this.close = this.close.bind(this)
    this.resize = this.resize.bind(this)
  }

  close() {
    this.props.close() || this.setState({ hidden: true })
  }

  resize() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  componentWillReceiveProps(nextProps: ISideBarProps) {
    this.setState({
      hidden: nextProps.hidden
    })
  }

  render() {
    let logo = (this.state.showLogo) ? (
        <div className="singular-sidebar-logo">
          <Link to="/">
            <div className="singular-logo">
              <span className="singular-logo-image"></span>
              <span className="singular-logo-text">{this.props.textLogo}</span>
            </div>
          </Link>
          <div className="singular-sidebar-close">
            <Icon glyph={{name: "remove"}} title="" hideTitle={true} onPress={this.close} />
          </div>
        </div>
      ) : null,
      expander = <Icon type="expander" glyph={{name: (this.state.expanded ? "double-arrow-left" : "double-arrow-right")}} title="" onPress={this.resize} />

    return (
      <aside className="singular-sidebar" aria-hidden={this.state.hidden} aria-expanded={this.state.expanded}>
        { logo }
        { expander }
        { this.props.children }
      </aside>
    )
  }
}

export const SidePaneDOM: React.StatelessComponent<ISidePaneProps> = (props) => {
  return (
    <div className="singular-side-content">
      { props.children }
    </div>
  )
}

export class SideViewDOM extends React.PureComponent<ISideViewProps, ISideViewState> {
  constructor(props: ISideViewProps) {
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
      <div className="singular-side-view">
        { this.props.children }
      </div>
    )
  }
}
