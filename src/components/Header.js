// @flow
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { AppHeader } from '@tarantool.io/ui-kit';

import core from '../coreInstance';
import { selectBreadcrumbs } from '../store/selectors';
import NotificationWidget from './NotificationWidget';

type HeaderProps = {
  appName: ?string,
  breadcrumbs: AppTitleProps[],
  dispatch: Function,
};

class Header extends React.Component<HeaderProps> {
  componentDidMount() {
    core.subscribe('setHeaderComponent', () => {
      this.forceUpdate();
    });
  }

  render() {
    const { appName, breadcrumbs, dispatch } = this.props;

    const onLinkClick = (path: string) => dispatch(push(path));

    return (
      <AppHeader
        appName={appName}
        breadcrumbs={breadcrumbs}
        className="test__Header"
        controls={[<NotificationWidget key={0} />, core.getHeaderComponent()]}
        onLinkClick={onLinkClick}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  appName: state.appTitle.appName,
  breadcrumbs: selectBreadcrumbs(state),
});

export default connect(mapStateToProps)(Header);
