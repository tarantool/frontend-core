import React from 'react';
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { isEqual, isEmpty } from 'lodash';
import NoComponent from './components/NoComponent'
import coreInstance from './coreInstance'
import type { MenuItemType } from './core'
import { allowRoute, disableRoute } from './store/actions/routes'

type RoutesProps = {
  menu: MenuItemType[],
  dispatch: Function,
  path: string,
  isRouteAllowed: boolean,
}

const mapRoutesModule = () => {
  const modules = coreInstance.getModules()
  return modules.map(module => (
    <Route key={module.namespace} path={'/' + module.namespace} component={module.RootComponent} />
  ))
}

const checkPathInMenu = (path: string, menu: MenuItemType[]): boolean => {
  return menu.some(item => path === item.path);
}

class Routes extends React.Component<RoutesProps> {
  componentDidMount () {
    coreInstance.subscribe('registerModule', () => {
      this.forceUpdate()
    })
  }

  componentDidUpdate (prevProps: RoutesProps): void {
    const { menu, path, dispatch } = this.props;

    if (
      !isEmpty(menu) && path &&
      (
        !isEqual(menu, prevProps.menu) ||
        !isEqual(path, prevProps.path)
      )
    ) {
      if (checkPathInMenu(path, menu)) {
        dispatch(allowRoute())
      } else {
        dispatch(disableRoute())
      }
    }
  }

  render () {
    const { isRouteAllowed } = this.props;
    return (
      <Switch>
        {isRouteAllowed && mapRoutesModule()}
        <Route path={'/'} component={NoComponent} />
      </Switch>
    )
  }
}

export default connect(({ menu, router, routes }) => {
  return {
    menu,
    path: router.location.pathname,
    isRouteAllowed: routes.isRouteAllowed
  }
})(Routes)
