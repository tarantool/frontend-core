import * as React from 'react'
import {css} from 'react-emotion'
import logo from './logo.svg'
import core from '../coreInstance'

const menuLine = `
  width: 32px;
  height: 3px;
  border-radius: 3px;
  background: white;
`;

const styles = {
  header: css`
    position: relative;
    
  `,
  menuBox: css`
    height: 23px;
    width: 32px;
    position: absolute;
    left: 20px;
    top: 13px;
  `,
  logo: css`
    position: absolute;
    left: 12px; 
    top: -1px;
  `
}

export class Header extends React.Component {

  componentDidMount(): void {
    core.subscribe('setHeaderComponent', () => {
      this.forceUpdate()
    })
  }



  render() {
    return (
      <React.Fragment>
        <div className={styles.header}>
          <img className={styles.logo} src={logo} style={{width: 146, height: 53}}/>
        </div>
        {core.getHeaderComponent()}
      </React.Fragment>
    )
  }

}
