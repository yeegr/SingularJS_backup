import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Icon, Glyph } from '../components'
import { IGlyphProps, IBadgeProps } from '../interfaces'

export interface IPanelProps {
  title: string
  key?: number
  glyph?: IGlyphProps
  badge?: IBadgeProps
  selected?: boolean
}

export interface ITabViewProps {
  type?: string
  size?: string
  selectedIndex?: number
  box?: string
}

export interface ITabViewState {
  type: string
  selectedIndex: number
}

export const PanelDOM: React.StatelessComponent<IPanelProps> = (props) => {
  return (
    <div key={props.key} className="singular-tab-panel" data-selected={props.selected}>
      { props.children }
    </div>
  )
}

export class TabViewDOM extends React.PureComponent<ITabViewProps, ITabViewState> {
  tabbarWrapper: HTMLElement
  tabbar: HTMLElement
  slideList: number[] = []
  tabList: HTMLElement[] = []
  tabIndicator: HTMLElement

  constructor(props: ITabViewProps) {
    super(props)

    this.state = {
      type: this.props.type || 'icon',
      selectedIndex: this.props.selectedIndex || 0
    }

    this.setupIndicator = this.setupIndicator.bind(this)
    this.slideIndicator = this.slideIndicator.bind(this)
  }

  componentDidUpdate() {
    this.slideIndicator()
  }

  componentDidMount() {
    this.setupIndicator()
    window.addEventListener('resize', this.setupIndicator)
  }

  selectedTag(selectedIndex: number) {
    this.setState({selectedIndex})
  }

  setupIndicator() {
    if (this.props.type === "text" && this.tabIndicator) {
      this.slideList = []

      let wrapperWidth = this.tabbarWrapper.offsetWidth,
        tabbarWidth = this.tabbar.offsetWidth,
        diff = tabbarWidth - wrapperWidth

      if (diff > 0) {
        this.tabList.forEach((t: HTMLElement, i: number) => {
          let offset = t.offsetLeft + (t.offsetWidth - wrapperWidth) / 2
          offset = (offset < 0) ? 0 : -offset
          offset = (Math.abs(offset) > diff) ? -diff : offset

          this.slideList.push(offset)
        })
      }

      this.slideIndicator()
    }
  }

  slideIndicator() {
    if (this.props.type === "text" && this.tabIndicator) {
      let selectedIndex = this.state.selectedIndex,
        currentTab = this.tabList[selectedIndex],
        boundingLeft = currentTab.offsetLeft,
        boundingWidth = currentTab.offsetWidth

      this.tabIndicator.style.width = currentTab.offsetWidth + 'px'
      this.tabIndicator.style.left = currentTab.offsetLeft + 'px'

      this.tabbar.style.left = this.slideList[selectedIndex] + 'px'
    }
  }

  render() {
    let { type, selectedIndex } = this.state,
      tabbarTabs: JSX.Element[] = [],
      tabContent: JSX.Element[] = [],
      tabbarIndicator: JSX.Element = null

    React.Children.forEach(this.props.children, (t: React.ReactElement<any>, i: number) => {
      let tab: JSX.Element,
        selected: boolean = (selectedIndex === i),
        {glyph, title, badge} = t.props

      if (this.props.box && !glyph.box) {
        glyph.box = this.props.box
      }

      switch (type) {
        case 'icon':
        default:
          tab = <Icon type="icon" key={'i'+i} selected={selected} glyph={glyph} title={title} badge={badge} onPress={() => this.selectedTag(i)} />
          tabbarTabs.push(tab)
        break

        case 'text':
          tab = <span key={'t'+i} ref={ref => this.tabList[i] = ref} data-selected={selected} onClick={() => this.selectedTag(i)}>{t.props.title}</span>
          tabbarTabs.push(tab)
          tabbarIndicator = <hr ref={ref => this.tabIndicator = ref} />
        break
      }

      let p = React.cloneElement(t, {key: 'p'+i, selected})
      tabContent.push(p)
    })

    return (
      <div className="singular-tab-view" data-type={this.props.type}>
        <aside ref={ref => this.tabbarWrapper = ref}>
          <div className="singular-tab-bar" ref={ref => this.tabbar = ref}>
            { tabbarTabs }
            { tabbarIndicator }
          </div>
        </aside>
        <div className="singular-tab-content">
          { tabContent }
        </div>
      </div>
    )
  }
}
