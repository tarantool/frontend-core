// @flow
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
// $FlowFixMe
import 'antd/dist/antd.less'
import history from './store/history';
import store from './store';
import './styles/reset';
import coreInstance from './coreInstance';
import { css } from 'react-emotion';
import NoComponent from './components/NoComponent';
import Menu from './components/Menu';
import Header from './components/Header';
import NotificationList from './components/NotificationList'

const sideColor = '#000000;';
const styles = {
  layout: css`
    display: flex;
    margin: 0 auto;
    height: 100vh;
    flex-direction: column;
	`,
  main: css`
		display:flex;
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
  `,
};

const mapRoutesModule = () => {
  const modules = coreInstance.getModules();
  return modules.map(module => (
    <Route key={module.namespace} path={'/' + module.namespace} component={module.RootComponent}/>
  ));
};

export default class App extends Component<any> {
  componentDidMount() {
    coreInstance.subscribe('registerModule', () => {
      this.forceUpdate();
    });
  }
  render() {
    return (
      <Provider store={store}>
        <div className={styles.layout}>
          <div className={styles.main}>
            <Menu className={styles.sidemenu}/>
            <div className={styles.content}>
              <Header/>
              <ConnectedRouter history={history}>
                <Switch >
                  {mapRoutesModule()}
                  <Route path={'/'} component={NoComponent}/>
                </Switch>
              </ConnectedRouter>
            </div>
            <NotificationList />
          </div>
        </div>
      </Provider>
    );
  }
}
