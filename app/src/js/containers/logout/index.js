import React from 'react'
import { Auth } from '../../lib/services/auth'

export default class Logout extends React.Component {

  doLogout() {
    const { history } = this.props
    Auth.logout(() => history.replace('/'))
  }

  componentDidMount() {
    this.doLogout()
  }

  render() {
    return null
  }
}
