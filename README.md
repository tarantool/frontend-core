# Tarantool Enterprise Front-end Core

It's core module for admin UI. Any UI submodules should be register at core.

It has two parts. Lua part as rock that will be used at your project. JS part that will be compiled at Lua bundle. JS part based on React.

# Architecture

## Javascript

It's based on CRA. But with some details. Core is just a little React app that can route to correct module.

It can register a module in any time and route to it. This is main purpose.

Module can be described by module namespace, react root component and menu description, which can be described in two way(about it later).

Example of integration register a module:

```
const Root = () => <div>Module</div>;
const core = window.tarantool_enterprise_core;
core.register('module', [{label: 'Module', path: '/module/'}], Root);
```

### window.tarantool_enterprise_core.register(namespace: string, menu: menuShape, RootComponent: ComponentType<any>, menuMiddleware?: (Object) => void)

#### namespace

name of namespace. It will be used as namespace of your module. Prepend for routing.

#### menu
It can be [reducer](https://redux.js.org/basics/reducers) for your menu or some static menu.


Default reducer(you can use something like this):

```
const matchPath = (path, link) => {
  const point = link.indexOf(path)
  return point === 0 && (link.length === path.length || link[path.length] === '/')
}

const selected = path => menuItem => ({
  ...menuItem,
  expanded: menuItem.items.length > 0
  ?( menuItem.path === path ? !menuItem.expanded : menuItem.expanded)
  : false,
})
const updateLink = path => menuItem => ({
    ...menuItem,
    selected: matchPath(path, menuItem.path)
})

const defaultReducer = (defaultState = []) => (state = defaultState, {type, payload}) => {
  console.log('default reducer', state, type, payload, defaultState)
  switch (type) {
    case constants.SELECT_MENU:
      return state.map(selected(payload.path))
    case '@@router/LOCATION_CHANGE':
      return state.map(updateLink(payload.location.pathname))
    case constants.RESET:
      return defaultState.map(updateLink(payload.path))
    default:
      return state
  }
}

```

Example of static menu:

```
[{label: 'Module', path: '/module/'}]
```

Or can be described in more way:

```
  label: string,
  path: string,
  selected: boolean,
  expanded: boolean,
  loading: boolean,
  items: [menuItem],
```

It's full state of menu item.

#### RootComponent

RootComponent can be any React Component. If you want using routing in module you should
using history from core component for menu updating.


Example with `react-router-dom`:

```
class Root extends React.Component{

  render() {
    return (
      <div>
        test namespace:
        <Router history={window.tarantool_enterprise_core.history}>
          <Switch>
            <Route path={'/test/test2'}  component={() => <div>2</div>}/>
            <Route path={'/test/test1'} component={() => <div>1</div>}/>
            <Route path={'/'} component={() => <div>Default</div>}/>
          </Switch>
        </Router>
      </div>
    )
  }
}
```

Route should using same namespace of module. You shold start all of your routes with `/test`.

You can use any technology inside that you want.

#### menuMiddleware

This is a redux middleware for dispatch some custom events or add reaction on your custom events.

It should be using if you want do async loading of menu elements or some another dynamic changes. Or you want dispatch action on menu events from other modules.


### window.tarantool_enterprise_core.checkNamespace(module: string)

Throw error if module is already registered.

### window.tarantool_enterprise_core.getModules() : Array\<module\>

Return registered modules.

### window.tarantool_enterprise_core.subscribe(eventType: string, callback: Function) : unsubscribe function

Return unsubscribe function.

Subscribe to events of certain type. This can be used for cross module reaction.

`callback(event)` - event could be anything include null.

Example:

```
const unwait = this.subscribe('registerModule', () => {
    const modules = this.getModules().filter(x => x.namespace === namespace)
    if (modules.length > 0) {
      unwait();
      resolve(true)
    }
})
```


### window.tarantool_enterprise_core.dispatch(eventType: stirng, event: any)

It's for cross module reaction. You can dispatch anything that you want.

## Rock

Core module and other UI modules bundled as Lua file that contains bundle files.

```
tarantoolctl rock make
```

Command above make a bundle. Then it could be included as module at Tarantool Enterprise Admin.

## Lua

```
local front = require('front')
local httpd = require('http.server').new('0.0.0.0', '5050')
front.http_register(httpd)
httpd:start()
```

This start a Tarantool Enterprise Admin without modules.

You can register a module in this way:

```
front.module_register('module_namespace', require('module_namespace'))
```

### front.http_register(httpd: httpd)

`httpd` argument - should be an instance of http tarantool module.

Register routes `/front/` and `/static/`, and redirect from `/` to `/front/` in `httpd`.

`/front/` - route for SPA admin module front-end.

`/static/` - route for static files that will be used at application.

### front.module_register(namespace: string, bundle: bundle)

`namespace` - using for namespace module. Should be same name as your JS namespace module.

`bundle` - table that consists of `{[filename] = {is_entry = boolean, body = string, mime = string}}`

`is_entry` - indicate that's JS enter file of your module.

`body` - content of file.

`mime` - mime-type of file.

`filename` - filename or filepath.

### front.get_modules()

Return all registered modules.

You can use this method if you want using your own routing.
