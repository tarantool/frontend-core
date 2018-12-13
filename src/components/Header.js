import * as React from 'react'
import {css} from 'react-emotion'
import logo from './logo.svg'

const styles = {
  header: css`
    position: relative;
    top: 50%;
    transform: translate3d(0, -50%, 0);
  `
}

export class Header extends React.Component{

  render() {
    return (
      <div className={styles.header}>
        <img src={logo}/>
      </div>
    )
  }

}
