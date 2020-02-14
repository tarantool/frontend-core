import './publicPath';
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import core from './coreInstance'
import AppTitle from './components/AppTitle'
import apiMethods from './api'
import analyticModule from './analytics'

core.components = {
  AppTitle
}

core.logo = require('./components/tarantool-logo.svg')

core.apiMethods = apiMethods
core.analyticModule = analyticModule

ReactDOM.render(<App />, document.getElementById('root'))

export default core
window.tarantool_enterprise_core = core
