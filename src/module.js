// we use webpack's dynamic public path feature to set path prefix from backend
import './publicPath'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import core from './coreInstance'
import AppTitle from './components/AppTitle'
import apiMethods from './api'
import analyticModule from './analytics'
import store from './store'

core.components = {
  AppTitle
}

core.logo = require('./assets/tarantool-logo-full.svg')

core.apiMethods = apiMethods
core.analyticModule = analyticModule

core.install = () => {
  ReactDOM.render(<App store={store} core={core}/>, document.getElementById('root'))
}

export default core
window.tarantool_enterprise_core = core
