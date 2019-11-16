import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import core from './coreInstance'
import AppTitle from './components/AppTitle'
import apiMethods from './api'

core.components = {
  AppTitle
}

core.logo = require('./components/tarantool-logo.svg')

core.apiMethods = apiMethods

ReactDOM.render(<App />, document.getElementById('root'))

export default core
window.tarantool_enterprise_core = core
