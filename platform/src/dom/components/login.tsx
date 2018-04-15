import * as React from 'react'
import * as Validate from 'validate.js'

import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as loginActions from '../../redux/actions/loginActions'
import { ILoginActions } from '../../redux/actions/loginActions'

import { CONFIG, LANG, UTIL, ERRORS, SETTINGS } from '../../common/'
import { TextField } from '../modules'

interface IProps {
  constraints: any
  _submit: Function
  loginActions: ILoginActions
}

interface IMessage {
  message: string
  role: string
}

interface IState {
  username: string
  password: string
  usernameMessage: IMessage
  passwordMessage: IMessage
}

class Login extends React.PureComponent<IProps, IState> {
  constraints: any

  _usernameMessage: IMessage = {
    message: LANG.t('user.login.username_instruction'),
    role: ''
  }

  _passwordMessage: IMessage = {
    message: LANG.t('user.login.password_instruction', {length: CONFIG.PLATFORM.MIN_PASSWORD_LENGTH}),
    role: ''
  }

  constructor(props: any) {
    super(props)

    this.constraints = {
      username: {
        presence: true,
        length: {
          minimum: CONFIG.PLATFORM.MIN_USERNAME_LENGTH,
          message: LANG.t('user.login.username_min_length', {length: CONFIG.PLATFORM.MIN_USERNAME_LENGTH})
        }
      },
      password: {
        presence: true,
        length: {
          minimum: CONFIG.PLATFORM.MIN_PASSWORD_LENGTH,
          message: LANG.t('user.login.password_min_length', {length: CONFIG.PLATFORM.MIN_PASSWORD_LENGTH})
        }
      }
    }

    this.state = {
      username: '',
      password: '',
      usernameMessage: this._usernameMessage,
      passwordMessage: this._passwordMessage
    }

    this._submit = this._submit.bind(this)
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps: any) {
    let {user, error} = nextProps.login

    if (user === null && error !== null) {
      switch (error.code) {
        case ERRORS.LOGIN.USER_NOT_FOUND:
          this.setState({
            usernameMessage: {
              message: error.message,
              role: 'error'
            }
          })
        break

        case ERRORS.LOGIN.PASSWORD_INCORRECT:
          this.setState({
            passwordMessage: {
              message: error.message,
              role: 'error'
            }
          })
        break
      }
    } else {

    }
  }

  _submit() {
    let username = this.state.username,
      password = this.state.password,
      err = Validate.validate({username, password}, this.constraints)

    if (err === undefined) {
      this.props.loginActions.loginUser({username, password})
    }
  }

  render() {
    return (
      <div className="singular-login-view">
        <div className="singular-login-form">
          <TextField
            type="text"
            name="username"
            required={true}
            placeholder={LANG.t('user.login.username_placeholder')}
            tabIndex={1}
            label={LANG.t('user.login.username')}
            maxLength={CONFIG.PLATFORM.MAX_USERNAME_LENGTH}
            constraints={this.constraints.username}
            instruction={this._usernameMessage.message}
            message={this.state.usernameMessage.message}
            role={this.state.usernameMessage.role}
            value={this.state.username}
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              let username = (e.target as HTMLInputElement).value.trim()
              this.setState({username})
            }}
            onClear={() => this.setState({username: ''})}
            onFocus={() => this.setState({usernameMessage: this._usernameMessage})}
          />
          <TextField
            type="password"
            name="password"
            required={true}
            placeholder={LANG.t('user.login.password_placeholder')}
            tabIndex={2}
            label={LANG.t('user.login.password')}
            maxLength={CONFIG.INPUT_LIMITS.MAX_PASSWORD_LENGTH}
            constraints={this.constraints.password}
            message={this.state.passwordMessage.message}
            role={this.state.passwordMessage.role}
            value={this.state.password}
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              let password = (e.target as HTMLInputElement).value.trim()
              this.setState({password})
            }}
            onFocus={() => this.setState({password: ''})}
          />
          <button className="singular-button" onClick={this._submit}>
            {LANG.t('base:operation.Login')}
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    login: state.login
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: any) => {
  return {
    loginActions: bindActionCreators(loginActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
