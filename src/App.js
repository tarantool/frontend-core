// @flow
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import Routes from './components/Routes'
import { colors } from '@tarantool.io/ui-kit'
// $FlowFixMe
import './styles/reset'
import { css, cx } from 'emotion'
import Menu from './components/Menu'
import Header from './components/Header'
import NotificationList from './components/NotificationList'
import FavIcon from './components/FavIcon'
import Core from './core'

type AppProps = {
  store: Object,
  core: Core
}

const styles = {
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
    height: 100vh;
    margin: 0 auto;
  `,
  flexMain: css`
    display: flex;
  `,
  content: css`
    display: block;
    background: ${colors.baseBg};
    flex-grow: 1;
    max-height: 100vh;
    overflow: auto;
  `,
  sidemenu: css`
    flex-grow: 0;
    flex-shrink: 0;
    box-sizing: border-box;
    z-index: 1;
  `
}

export default class App extends Component<AppProps> {
  render() {
    const { store, core } = this.props
    return (
      <Provider store={store}>
        <div className={cx(styles.main, 'meta-tarantool-app')}>
          <FavIcon />
          <Menu className={styles.sidemenu} />
          <div className={styles.content}>
            <Header />
            <Routes core={core} />
          </div>
          <NotificationList />
        </div>
      </Provider>
    )
  }
}
