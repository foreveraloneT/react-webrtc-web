import React, { Component } from 'react'
import { map } from 'lodash'
import { Auth } from '../../lib/services/auth'
import * as validator from '../../lib/utils/validation'
import styles from './login.scss'

class Login extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      error: false,
      process: false
    }
  }

  redirectToLocation() {
    const { location, history } = this.props
    if (location.state && location.state.nextPathname) {
      history.replace(location.state.nextPathname)
    } else {
      history.replace('/')
    }
  }

  componentDidMount() {
    if (Auth.isLoggedIn()) {
      this.redirectToLocation()
    }
  }

  isValidForm() {
    const { email, password } = this.refs;

    const error = []

    if (email.value.trim().length <= 0) {
      error.push('Email is required.')
    } else if (!validator.isEmail(email.value)) {
      error.push('Invalid Email address')
    }

    if (password.value.trim().length <= 0) {
      error.push('Password is required.')
    }

    return error.length > 0 ? error : true
  }

  doLogin(event) {
    const { email, password } = this.refs;

    this.setState({ error: false })
    const valid = this.isValidForm()
    if (valid === true) {
      this.setState({ process: true })
      Auth.login(email.value, password.value)
        .then(
          (data) => {
            Auth.setToken(data)
            this.redirectToLocation()
          }
          , error => this.setState({ error, process: false })
        )
    } else {
      this.setState({ error: valid, process: false })
    }

    event.preventDefault()
    return false
  }

  renderError(error) {
    return (
      <ul className={styles.error_messages}>
        { map(error, (err, key) => <li key={key} >{ err }</li>) }
      </ul>
    )
  }

  render() {
    return (
      <div id="login-form" className={styles.container}>
        <div className={styles.login}>
          <form onSubmit={this.doLogin.bind(this)} method="POST">
            <h1>Log in</h1>
            <div className={styles.form_item}>
              <input type="text" ref="email" name="username" placeholder="Email address" />
            </div>
            <div className={styles.form_item}>
              <input type="password" ref="password" name="password" placeholder="Password" />
            </div>

            { this.state.error !== false ? this.renderError(this.state.error) : null }
            <div className={styles.form_submit}>
              <button disabled={this.state.process} >
                { this.state.process !== false ? 'Please wait...' : 'Log in' }
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
