// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { css, cx } from 'react-emotion'
import { Breadcrumbs } from '@tarantool.io/ui-kit'
import { selectBreadcrumbs } from '../store/selectors'
import { push } from 'connected-react-router'
import core from '../coreInstance'
import NotificationWidget from './NotificationWidget'

const styles = {
  header: css`
    height: 68px;
    background: #ffffff;
    width: 100%;
    display: flex;
    padding: 0 30px;
    box-sizing: border-box;
    flex-direction: row;
    align-items: center;
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
  titleContainer: css`
    flex-grow: 1;
    flex-shrink: 0;
  `,
  infoContainer: css`
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
  `
}

type HeaderProps = {
  appName: ?string,
  breadcrumbs: AppTitleProps[],
  dispatch: Function
}

class Header extends React.Component<HeaderProps> {
  componentDidMount() {
    core.subscribe('setHeaderComponent', () => {
      this.forceUpdate()
    })
  }

  render() {
    const { appName, breadcrumbs, dispatch } = this.props

    const onLinkClick = (path: string) => dispatch(push(path))

    return (
      <div className={cx(styles.header, 'test__Header')}>
        <div className={styles.titleContainer}>
          <Breadcrumbs
            appName={appName}
            breadcrumbs={breadcrumbs}
            onLinkClick={onLinkClick}
          />
        </div>
        <div className={styles.infoContainer}>
          <NotificationWidget />
          {core.getHeaderComponent()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  appName: state.appTitle.appName,
  breadcrumbs: selectBreadcrumbs(state)
})

export default connect(mapStateToProps)(Header)
