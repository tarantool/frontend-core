// @flow
import React, { Component } from 'react'
import { Location } from 'history';
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
import FavIcon from './components/FavIcon'

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

type AppState = {
  routeIsAllowed: boolean,
}

export default class App extends Component<any, AppState> {
  unlisten: () => void;
  unsubscribe: () => void;

  state: AppState = {
    routeIsAllowed: true
  };

  componentWillMount () {
    this.unlisten = history.listen((location: Location) => {
      this.setState({
        routeIsAllowed: this.checkRoute(location)
      });
    });

    this.unsubscribe = store.subscribe(() => {
      this.setState({
        routeIsAllowed: this.checkRoute(history.location)
      });
    });
  }

  componentDidMount () {
    coreInstance.subscribe('registerModule', () => {
      this.forceUpdate()
    })
  }

  componentWillUnmount () {
    this.unlisten();
    this.unsubscribe();
  }

  checkRoute = (location: Location) => {
    const modules = coreInstance.getModules();
    const clusterModule = modules.find(module => module.namespace === 'cluster');
    if (!clusterModule) {
      return true;
    }

    return clusterModule.menuFilter ? clusterModule.menuFilter({ path: location.pathname }) : true;
  }

  render () {
    return (
      <Provider store={store}>
        <div className={styles.layout}>
          <FavIcon />
          <div className={styles.main}>
            <Menu className={styles.sidemenu} />
            <div className={styles.content}>
              <Header />
              <ConnectedRouter history={history}>
                <Switch>
                  {this.state.routeIsAllowed && mapRoutesModule()}
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
