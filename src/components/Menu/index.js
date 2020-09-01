// @flow

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { css } from 'emotion'
import { push } from 'connected-react-router'
import { SideMenu } from '@tarantool.io/ui-kit'
import type { MenuItemType } from '../../core'
import { expand } from '../../store/actions/menu'
import { selectMenu } from '../../store/selectors'
import { APP_PATH_PREFIX } from '../../store/history'
import logo from '../../assets/tarantool-logo-full.svg'
import logoCompact from '../../assets/tarantool-logo-compact.svg'

type MenuProps = {
  menu: Array<MenuItemType>,
  dispatch: Function,
  path: string,
  className: string
}

const logoStyle = css`margin-left: 24px;`;

const renderLogo = collapsed => (
  <img
    className={!collapsed && logoStyle}
    src={collapsed ? logoCompact : logo}
  />
);

export function Index(props: MenuProps) {
  const { menu, dispatch, path, className } = props
  const [isInited, setIsInited] = useState(path !== '/')

  if (!isInited) {
    if (menu.length > 0) {
      const notSelected = menu.filter(x => x.selected).length === 0
      if (notSelected) {
        const path = menu[0].path
        dispatch(push(path))
      }
      setIsInited(true)
    }
  }

  const onClick = (path, type) => {
    if (type === 'external') {
      window.open(path, '_blank')

      return;
    }

    dispatch(push(path))
  }

  const onExpand = (path, expanded) => {
    dispatch(expand(path, expanded))
  }

  return (
    <SideMenu
      menu={menu}
      path={path}
      onMenuItemClick={onClick}
      toggleExpand={onExpand}
      className={className}
      pathPrefix={APP_PATH_PREFIX}
      renderMenuLogo={renderLogo}
    />
  )
}

export default connect(state => {
  return {
    menu: selectMenu(state),
    path: state.router.location.pathname
  }
})(Index)
