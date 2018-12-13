import * as React from 'react'
import {css} from 'react-emotion'
import Menu from './Menu'
import Header from './Header'

const styles = {
  layout: css`
    display: flex;
    flex-direction: column;
  `,
  header: css`
    background: red;
    height: 100px;
    flex-grow: 0;
    flex-shrink: 0;
  `,
  main: css`
    display: flex;
    flex-direction: row;  
  `,
  menu: css`
    height: 100vh;
    width: 300px;
    flex-grow: 0;
    background: black;
  `,
  content: css`
    height: 100vh;
    flex-grow: 1;
  `
}

export default class Layout extends React.Component{

  render() {
    return (
      <div className={styles.layout}>
        <div className={styles.header}>
          <Header/>
        </div>
        <div className={styles.main}>
          <div className={styles.menu}>
            <Menu />
          </div>
          <div className={styles.content}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }

}
