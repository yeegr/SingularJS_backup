import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { IconDOM as Icon } from './icon'
import { GlyphDOM as Glyph, IGlyphProps } from './glyph'

export interface IPanelProps {
  title: string
  key?: number
  glyph?: IGlyphProps
  badge?: string | number
  selected?: boolean
}

export interface ITabViewProps {
  type?: string
  selectedIndex?: number
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
    if (this.props.type === "text" && this.tabIndicator) {
      this.slideIndicator()
    }
  }

  componentDidMount() {
    if (this.props.type === "text" && this.tabIndicator) {
      this.setupIndicator()

      window.addEventListener('resize', () => {
        this.setupIndicator()
      })
    }
  }

  selectedTag(selectedIndex: number) {
    this.setState({selectedIndex})
  }

  setupIndicator() {
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

  slideIndicator() {
    let selectedIndex = this.state.selectedIndex,
      currentTab = this.tabList[selectedIndex],
      boundingLeft = currentTab.offsetLeft,
      boundingWidth = currentTab.offsetWidth

    this.tabIndicator.style.width = currentTab.offsetWidth + 'px'
    this.tabIndicator.style.left = currentTab.offsetLeft + 'px'

    this.tabbar.style.left = this.slideList[selectedIndex] + 'px'
  }

  render() {
    let { type, selectedIndex } = this.state,
      tabbarTabs: JSX.Element[] = [],
      tabContent: JSX.Element[] = [],
      tabbarIndicator: JSX.Element = null

    React.Children.forEach(this.props.children, (t: React.ReactElement<any>, i: number) => {
      let tab: JSX.Element,
        selected: boolean = (selectedIndex === i)

      switch (type) {
        case 'icon':
        default:
          tab = <Icon key={'t'+i} selected={selected} glyph={t.props.glyph} title={t.props.title} onPress={() => this.selectedTag(i)} />
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
        <div className="singular-tab-wrapper">
          { tabContent }
        </div>
      </div>
    )
  }
}
