// @flow
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { css } from '@emotion/css';
import { push } from 'connected-react-router';
import { SideMenu } from '@tarantool.io/ui-kit';

import logoCompact from '../../assets/tarantool-logo-compact.svg';
import logo from '../../assets/tarantool-logo-full.svg';
import { useCore } from '../../context';
import type { MenuItemType } from '../../core';
import { expand } from '../../store/actions/menu';
import { APP_PATH_PREFIX } from '../../store/history';
import { selectMenu } from '../../store/selectors';

type MenuProps = {
  menu: Array<MenuItemType>,
  dispatch: Function,
  path: string,
  className: string,
};

const logoStyle = css`
  margin-left: 24px;
`;

const renderLogo = (collapsed) => (
  <img alt="Logo" className={!collapsed ? logoStyle : undefined} src={collapsed ? logoCompact : logo} />
);

export function Index({ menu, dispatch, path, className }: MenuProps) {
  const core = useCore();
  const [isInited, setIsInited] = useState(path !== '/');
  const [isCollapsed, setIsCollapsed] = useState(core ? core.ls.get('menu_collapsed') === '1' : false);

  useEffect(() => {
    if (core) {
      core.ls.set('menu_collapsed', isCollapsed ? '1' : '0');
    }
  }, [isCollapsed, core]);

  if (!isInited && menu.length > 0) {
    const notSelected = menu.filter((x) => x.selected).length === 0;
    if (notSelected) {
      const path = menu[0].path;
      dispatch(push(path));
    }
    setIsInited(true);
  }

  const onClick = (path, type) => {
    if (type === 'external' && typeof window !== 'undefined') {
      window.open(path, '_blank');

      return;
    }

    dispatch(push(path));
  };

  const onExpand = (path, expanded) => {
    dispatch(expand(path, expanded));
  };

  return (
    <SideMenu
      menu={menu}
      path={path}
      onMenuItemClick={onClick}
      toggleExpand={onExpand}
      className={className}
      pathPrefix={APP_PATH_PREFIX}
      renderMenuLogo={renderLogo}
      isCollapsed={isCollapsed}
      onCollapse={setIsCollapsed}
    />
  );
}

export default connect((state) => {
  return {
    menu: selectMenu(state),
    path: state.router.location.pathname,
  };
})(Index);
