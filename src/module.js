import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import core from './coreInstance'
import AppTitle from './components/AppTitle'

core.components = {
  AppTitle,
}

ReactDOM.render(<App />, document.getElementById('root'))

export default core
window.tarantool_enterprise_core = core
