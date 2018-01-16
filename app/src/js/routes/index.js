import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import App from '../containers/App'
import Login from '../containers/login'
import Logout from '../containers/logout'
import Dashboard from '../containers/dashboard'
import ErrorPage from '../components/ErrorPage'
import { Auth } from '../lib/services/auth'

const PrivateRoute = (props) => {
  if (Auth.isLoggedIn()) {
    return <Route {...props} />
  }
  return <Redirect to={{ pathname: '/login', state: { from: props.path } }} />
}

const routes = (
  <Router>
    <App>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />

        <Route path="/" component={Dashboard} />

        <Route path="*" component={ErrorPage} />
      </Switch>
    </App>
  </Router>
)

export default routes
