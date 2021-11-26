// @flow
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { AppHeader } from '@tarantool.io/ui-kit';

import { useCore } from '../context';
import { selectBreadcrumbs } from '../store/selectors';
import { useForceUpdate } from '../utils/hooks';
import NotificationWidget from './NotificationWidget';

type HeaderProps = {
  appName: ?string,
  breadcrumbs: AppTitleProps[],
  dispatch: Function,
};

const Header = memo(({ appName, breadcrumbs, dispatch }: HeaderProps) => {
  const core = useCore();
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (!core) {
      return;
    }

    return core.subscribe('setHeaderComponent', () => {
      forceUpdate();
    });
  }, [core, forceUpdate]);

  const onLinkClick = useCallback((path: string) => dispatch(push(path)), []);

  const controls = useMemo(
    () => [<NotificationWidget key={0} />, core ? core.getHeaderComponent() : null].filter(Boolean),
    [core]
  );

  return (
    <AppHeader
      appName={appName}
      breadcrumbs={breadcrumbs}
      className="test__Header"
      controls={controls}
      onLinkClick={onLinkClick}
    />
  );
});

const mapStateToProps = (state) => ({
  appName: state.appTitle.appName,
  breadcrumbs: selectBreadcrumbs(state),
});

export default connect(mapStateToProps)(Header);
