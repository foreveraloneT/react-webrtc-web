import React from 'react'
import DevTools from './DevTools'
import routes from '../routes'

export default class Root extends React.Component {
  render() {
    return (
      <div id='main-container'>
        { routes }
        { process.env.NODE_ENV === 'production' ? null : <DevTools /> }
      </div>
    )
  }
}
