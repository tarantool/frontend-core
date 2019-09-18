// @flow
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
// $FlowFixMe
import 'antd/dist/antd.less'
import history from './store/history'
import store from './store'
import './styles/reset'
import coreInstance from './coreInstance'
import { css } from 'react-emotion'
import NoComponent from './components/NoComponent'
import Menu from './components/Menu'
import Header from './components/Header'
import NotificationList from './components/NotificationList'
import Helmet from 'react-helmet'

const sideColor = '#000000;'
const styles = {
  layout: css`
    display: flex;
    margin: 0 auto;
    height: 100vh;
    flex-direction: column;
  `,
  main: css`
    display: flex;
    flex-grow: 1;
    flex-shrink: 0;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
    max-width: 100vw;
  `,
  flexMain: css`
    display: flex;
  `,
  content: css`
    display: block;
    background: #f0f2f5;
    flex-grow: 1;
    max-height: 100vh;
    overflow: auto;
  `,
  sidemenu: css`
    flex-grow: 0;
    flex-shrink: 0;
    box-sizing: border-box;
    background: ${sideColor};
    z-index: 1;
  `
}

const mapRoutesModule = () => {
  const modules = coreInstance.getModules()
  return modules.map(module => (
    <Route key={module.namespace} path={'/' + module.namespace} component={module.RootComponent} />
  ))
}

export default class App extends Component<any> {
  componentDidMount () {
    coreInstance.subscribe('registerModule', () => {
      this.forceUpdate()
    })
  }
  render () {
    return (
      <Provider store={store}>
        <div className={styles.layout}>
          <Helmet>
            <link rel="apple-touch-icon" sizes="57x57" href="/static/core/apple-touch-icon-57x57.png" />
            <link rel="apple-touch-icon" sizes="60x60" href="/static/core/apple-touch-icon-60x60.png" />
            <link rel="apple-touch-icon" sizes="72x72" href="/static/core/apple-touch-icon-72x72.png" />
            <link rel="apple-touch-icon" sizes="76x76" href="/static/core/apple-touch-icon-76x76.png" />
            <link rel="apple-touch-icon" sizes="114x114" href="/static/core/apple-touch-icon-114x114.png" />
            <link rel="apple-touch-icon" sizes="120x120" href="/static/core/apple-touch-icon-120x120.png" />
            <link rel="apple-touch-icon" sizes="144x144" href="/static/core/apple-touch-icon-144x144.png" />
            <link rel="apple-touch-icon" sizes="152x152" href="/static/core/apple-touch-icon-152x152.png" />
            <link rel="apple-touch-icon" sizes="167x167" href="/static/core/apple-touch-icon-167x167.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/static/core/apple-touch-icon-180x180.png" />
            <link rel="apple-touch-icon" sizes="1024x1024" href="/static/core/apple-touch-icon-1024x1024.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/static/core/favicon-16x16.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/static/core/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="228x228" href="/static/core/coast-228x228.png" />
            <link rel="icon" type="image/png" sizes="196x196" href="/static/core/coast-196x196.png" />
            <link rel="icon" type="image/png" sizes="512x512" href="/static/core/coast-512x512.png" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" />
            <meta name="application-name" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="msapplication-TileColor" content="#fff" />
            <meta name="theme-color" content="#fff" />
          </Helmet>
          <div className={styles.main}>
            <Menu className={styles.sidemenu} />
            <div className={styles.content}>
              <Header />
              <ConnectedRouter history={history}>
                <Switch>
                  {mapRoutesModule()}
                  <Route path={'/'} component={NoComponent} />
                </Switch>
              </ConnectedRouter>
            </div>
            <NotificationList />
          </div>
        </div>
      </Provider>
    )
  }
}
