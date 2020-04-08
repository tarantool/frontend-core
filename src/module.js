// we use webpack's dynamic public path feature to set path prefix from backend
import './publicPath';
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import core from './coreInstance'
import AppTitle from './components/AppTitle'
import apiMethods from './api'
import analyticModule from './analytics'
import pageFilter from './pageFilter'

core.components = {
  AppTitle
}

core.pageFilter = pageFilter

core.logo = require('./components/tarantool-logo.svg')

core.apiMethods = apiMethods
core.analyticModule = analyticModule

ReactDOM.render(<App />, document.getElementById('root'))

export default core
window.tarantool_enterprise_core = core
