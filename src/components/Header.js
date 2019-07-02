// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import { selectTitle } from '../store/title/selectors';
import logo from './logo.svg';
import core from '../coreInstance';

const styles = {
  header: css`
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    height: 50px;
    background: #61000D;
  `,
  logoWrap: css`
    position: relative;
    flex-shrink: 0;
    width: 243px;
  `,
  logo: css`
    position: absolute;
    left: 12px; 
    top: -1px;
    width: 146px;
    height: 53px;
  `,
  title: css`
    flex-grow: 0;
    align-self: center;
    margin: 10px 20px 10px 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 16px;
    color: white;
  `,
};

type HeaderProps = {
  title: string
};

class Header extends React.Component<HeaderProps> {
  componentDidMount() {
    core.subscribe('setHeaderComponent', () => {
      this.forceUpdate();
    });
  }

  render() {
    return (
      <div className={styles.header}>
        <div className={styles.logoWrap}>
          <img className={styles.logo} src={logo} />
        </div>
        <h1 className={styles.title}>{this.props.title}</h1>
        {core.getHeaderComponent()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  title: selectTitle(state),
});

export default connect(mapStateToProps)(Header);
