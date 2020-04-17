// @flow
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import Routes from './components/Routes'
// $FlowFixMe
import 'antd/dist/antd.less'
import './styles/reset'
import { css } from 'react-emotion'
import Menu from './components/Menu'
import Header from './components/Header'
import NotificationList from './components/NotificationList'
import FavIcon from './components/FavIcon'
import Core from './core'

type AppProps = {
  store: Object,
  core: Core
}

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

export default class App extends Component<AppProps> {
  render() {
    const { store, core } = this.props
    return (
      <Provider store={store}>
        <div className={styles.layout}>
          <FavIcon />
          <div className={styles.main}>
            <Menu className={styles.sidemenu} />
            <div className={styles.content}>
              <Header />
              <Routes core={core} />
            </div>
            <NotificationList />
          </div>
        </div>
      </Provider>
    )
  }
}
