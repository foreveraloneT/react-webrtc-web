import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import Root from './containers/Root'
import configureStore from './stores/configureStore'

render(
  <Provider store={configureStore()}>
    <Root />
  </Provider>,
  document.getElementById('app')
);
