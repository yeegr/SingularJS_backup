import * as React from 'react'
import * as Validate from 'validate.js'

import { Glyph } from '../components'
import { IGlyphProps } from '../interfaces'

interface ITextFieldProps {
  type: string
  name: string
  required?: boolean
  label?: string
  placeholder?: string
  tabIndex?: number
  maxLength?: number
  constraints?: any
  instruction?: string
  message?: string
  role?: string
  pattern?: string
  value?: string

  onClear?: () => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void
}

interface ITextFieldState {
  type: string
  toggleGlyph: string
  message: string
  value: string
  role: string
}

export class TextFieldDOM extends React.PureComponent<ITextFieldProps, ITextFieldState> {
  constructor(props: ITextFieldProps) {
    super(props)

    this.state = {
      type: this.props.type,
      value: this.props.value || '',
      toggleGlyph: "password-visible",
      message: this.props.message || this.props.instruction || '',
      role: this.props.role || ''
    }

    this._onBlur = this._onBlur.bind(this)
    this._onToggle = this._onToggle.bind(this)
  }

  _onBlur() {
    let { constraints } = this.props,
      value = this.state.value.trim()

    if (constraints) {
      let message = Validate.single(value, constraints)
      
      this.setState({
        message: message || this.props.instruction,
        role: message ? 'warning' : null
      })
    } else {
      this.setState({
        message: this.props.instruction || '',
        role: ''
      })
    }
  }

  _onToggle() {
    if (this.state.type === "password")  {
      this.setState({
        type: "text",
        toggleGlyph: "password-hidden"
      })
    } else {
      this.setState({
        type: "password",
        toggleGlyph: "password-visible"
      })
    }
  }

  componentWillReceiveProps(nextProps: any) {
    this.setState(nextProps)
  }

  render() {
    let { type, message, toggleGlyph, value } = this.state

    let button: JSX.Element = null

    switch (this.props.type) {
      case 'password':
        button = (
          <button onClick={this._onToggle}>
            <Glyph name={this.state.toggleGlyph} />
          </button>
        )
      break

      case 'email':
      case 'tel':
      case 'text':
        button = (
          <button onClick={this.props.onClear}>
            <Glyph name="clear" />
          </button>
        )
      break
    }
    
    return (
      <div className="singular-input" aria-required={this.props.required}>
        <label>{this.props.label}</label>
        <div className="singular-input-main">
          <div className="singular-text-field">
            <input
              type={type}
              value={value}
              name={this.props.name}
              required={this.props.required}
              placeholder={this.props.placeholder}
              tabIndex={this.props.tabIndex}
              maxLength={this.props.maxLength}
              onBlur={this._onBlur}
              onFocus={this.props.onFocus}
              onInput={this.props.onInput}
            />
          </div>
          { button }
        </div>
        <span className="singular-input-message" role={this.state.role}>
          {message}
        </span>
      </div>
    )
  }
}