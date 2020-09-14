// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { AppHeader } from '@tarantool.io/ui-kit'
import { selectBreadcrumbs } from '../store/selectors'
import { push } from 'connected-react-router'
import core from '../coreInstance'
import NotificationWidget from './NotificationWidget'

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
      <AppHeader
        appName={appName}
        breadcrumbs={breadcrumbs}
        className='test__Header'
        controls={[
          <NotificationWidget />,
          core.getHeaderComponent()
        ]}
        onLinkClick={onLinkClick}
      />
    )
  }
}

const mapStateToProps = state => ({
  appName: state.appTitle.appName,
  breadcrumbs: selectBreadcrumbs(state)
})

export default connect(mapStateToProps)(Header)
