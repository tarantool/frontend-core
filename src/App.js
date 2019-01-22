import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { Route, Switch,  } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import history from './store/history'
import store from './store'
import './styles/reset'
import coreInstance from './coreInstance'
import {css} from 'react-emotion'
import NoComponent from './components/NoComponent'
import Menu from "./components/Menu";
import { Header } from './components/Header'

const sideColor = '#343434;';
const styles = {
  layout: css`
    display: flex;
    margin: 0 auto;
    height: 100vh;
    flex-direction: column;
	`,
  head: css`
		height: 50px;
		background: #61000D;
		flex-grow: 0;
    flex-shrink: 0;
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
    background: white;
    flex-grow: 1;
  `,
  sidemenu: css`
    display: block;
    flex-grow: 0;
    flex-shrink: 0;
    width: 243px;
    box-sizing: border-box;
    padding: 30px 0px 30px 21px;
    background: white;
    border-right: 2px solid black;
    background: ${sideColor};
  `,
};

const mapRoutesModule = () => {
  const modules = coreInstance.getModules()
  return modules.map(module => <Route key={module.namespace} path={'/'+module.namespace} component={module.RootComponent}/>)
};

export default class App extends Component {
  componentDidMount() {
    coreInstance.subscribe('registerModule', () => {
      this.forceUpdate()
    })
  }
  render() {
    return (
      <Provider store={store}>
        <div className={styles.layout}>
          <div className={styles.head}>
            <Header/>
          </div>
          <div className={styles.main}>

              <div className={styles.sidemenu}>
                <Menu/>
              </div>
              <div className={styles.content}>
                <ConnectedRouter history={history}>
                    <Switch >
                      {mapRoutesModule()}
                      <Route path={'/'} component={NoComponent}/>
                    </Switch>
                </ConnectedRouter>
              </div>

          </div>
        </div>
      </Provider>
    )
  }
}
