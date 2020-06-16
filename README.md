# Tarantool Front-end Core

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

### window.tarantool_enterprise_core.install()

Register main react element in #root element. In Lua part it's called by default.

### window.tarantool_enteprise_core.registerModule({ namespace: string, menu: menuShape, RootComponent: ComponentType<any>, menuMiddleware?: (Object) => void})

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

### window.tarantool_enterprise_core.register(namespace: string, menu: menuShape, RootComponent: ComponentType<any>, menuMiddleware?: (Object) => void, menuFilter?: (MenuItem) => boolean)

Deprecated method. Arguments type same as new method.

#### menuMiddleware

This is a redux middleware for dispatch some custom events or add reaction on your custom events.

It should be using if you want do async loading of menu elements or some another dynamic changes. Or you want dispatch action on menu events from other modules.

### window.tarantool_enterprise_core.checkNamespace(module: string)

Throw error if module is already registered.

### window.tarantool_enterprise_core.getModules() : Array\<module\>

Return registered modules.

### window.tarantool_enterprise_core.notify({ title: string, message: string, details?: string, type: 'default' | 'success' | 'error', timeout: number}) : void

Show notification. Title and message are text of notication.

Type influence on view of notification.

Timeout is time in miliseconds for automatic hide notification. If timeout = 0. It's infinite time. You only can close it by your hands.

### window.tarantool_enterprise_core.dispatch('setAppName', name: string)

Sets application name.

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


### window.tarantool_enterprise_core.dispatch(eventType: string, event: any)

It's for cross module reaction. You can dispatch anything that you want.

### window.tarantool_enterprise_core.components

Collection of React components working with frontend core.

Example:

`AppTitle` - sets application title

### window.tarantool_enterprise_core.apiMethods.registerAxiosHandler(eventType: 'request' | 'response' | 'requestError' | 'responseError', handler: (any, Array<handlers>) => any, priority?: number = 0)

Register axios handler. It's use a single responsibility chain inside. Handler should looks like:

```
(r, next) => next(r + 1)
```

Handlers with negative priority will be called before handlers without priority.

More about context of usage [https://github.com/axios/axios#interceptors]. So request is request interceptor and requestError it's error on request. Also same for response with interceptors.response.

### window.tarantool_enterprise_core.apiMethods.axiosWizard(axiosInstance)

You should use it for your axios instance for using same middlewares.

Example:

```
window.tarantool_enterprise_core.apiMethods.axiosWizard(axiosInstance)
```

### window.tarantool_enterprise_core.apiMethods.registerApolloHandler(eventType: 'middleware' | 'onError' | 'afterware', handler: (any, Array<handlers>) => any, priority?: number)

Register handler for Apollo. Handler should looks like it:

```
(r, next) => next(r + 1)
```

* `middleware` runs before query;

* `afterware` handles successful responses;

* `onError` handles errors.

Handlers with negative priority will be called before handlers without priority.

More information here: [https://www.apollographql.com/docs/react/networking/network-layer/]

### window.tarantool_enterprise_core.apiMethods.apolloLinkMiddleware

Link middleware. Should use for working handlers.

Example of usage:

```
import { from } from 'apollo-link'

new ApolloClient({
    link: from([
        window.tarantool_enterprise_core.apiMethods.apolloLinkMiddleware,
        yourHttpLink,
    ])
})
```

### window.tarantool_enterprise_core.apiMethods.apolloLinkAfterware

Link afterware. Should use for working handlers.

Example of usage:

```
import { from } from 'apollo-link'

new ApolloClient({
    link: from([
        window.tarantool_enterprise_core.apiMethods.apolloLinkAfterware,
        yourHttpLink,
    ])
})
```

### window.tarantool_enteprise_core.analyticModule

We add our analytic abstraction module. It support 2 types of event: Pageview and Action. By default it doesn't send any information.

You could send event with sendEvent and add own implementation of analytic by usage effect.

```
window.tarantool_enteprise_core.analyticModule.sendEvent({
    type: 'pageview',
    url: 'https://tarantool.io'
})

const unsub = window.tarantool_enterprise.analyticModule.effect((event) => {
    axios.post('https://myanalytics.io', { pageview: event.url })
})

unsub() // unsubscribe from effect
```


Typings:

```
type Action = {
  type: 'action',
  action: string,
  category: string,
  label?: string,
  value?: number
}

type PageView = {
  type: 'pageview',
  url: string
}

type AnalyticsEvent = Action | PageView

sendEvent(AnalyticsEvent)
effect(Function)
```


### window.tarantool_enterprise_core.pageFilter.registerFilter(MenuItem => boolean): unsubscribeFn

Register page filter and return unsubscibe function.

### window.tarantool_enterprise_core.pageFilter.applyFilters(MenuItemType[]):  MenuItemType[]

Filter out pages.

### window.tarantool_enterprise_core.pageFilter.filterPage(MenuItemType):  boolean

Does page pass filters

### window.\_\_tarantool_variables

Object contains values passed from lua part.

### Core events

`dispatchToken` - transmits action to core redux store.

Example:
```
window.tarantool_enterprise_core.dispatch('dispatchToken', { type: 'ADD_CLUSTER_USERS_MENU_ITEM' });
```

### Emittable core events

`setHeaderComponent` - Header component was passed to frontend core.

`core:pageFilter:apply` - Emits on modifying page filters before applying. Provides an array of filtering functions.

`core:pageFilter:applied` - Emits on modifying page filters aftter applying. Provides an array of filtering functions.

## Rock

Core module and other UI modules bundled as Lua files that contains bundle files.

```console
$ tarantoolctl rocks install frontend-core
$ tarantool -l pack-front - build/bundle.json build/bundle.lua
```

Command above make a bundle. Then it could be included as module at Tarantool Enterprise Admin.

Bundle usually contains a table

```lua
{
  [filename] = {
    is_entry = boolean,
    body = string,
    mime = string
  },
  ...
}
```

- `is_entry` - indicate that's JS enter file of your module.
- `body` - content of file.
- `mime` - mime-type of file.
- `filename` - filename or filepath.

## Lua

```
local http = require('http.server')
local httpd = http.new('0.0.0.0', '5050')
httpd:start()

local front = require('frontend-core')
front.init(httpd, {
	enforce_root_redirect = false,
	prefix = '/tarantool',
})
```

This start a Tarantool Enterprise Admin without modules.

You can register a module in this way:

```
local my_module_bundle = require('my_module.bundle')
front.add('module_namespace', my_module_bundle)
```

### init(httpd: httpd, { enforce_root_redirect: boolean, prefix: string })

`httpd` argument - should be an instance of a Tarantool HTTP server.

`enforce_root_redirect` - optional key which controls redirection to frontend-core app from '/' path, default true.

`prefix` - optional, adds path prefix to frontend-core app.

Register routes `/admin/` and `/static/`, and redirect from `/` to `/admin/` in `httpd`.

`/admin/` - route for single page application admin module front-end.

`/static/` - route for static files that will be used at application.

### add(namespace, bundle)

`namespace` - using for namespace module. Should be same name as your JS namespace module.

`bundle` - a frontend bundle loaded as a lua table.

### set_variable(key, value)

Passes value from lua to browser's global object `__tarantool_variables`.

Example:
```lua
front.set_variable('authPath', 'https://sso.example.com')
front.set_variable('thresold', 42)
front.set_variable('editorParams', {smarttabs: true, padding: 2})
```

## Development usage

You can use it in your frontend development mode with our npm package `@tarantoo.io/frontend-core`, but you need use external `react` and `react-dom` from our package.

### Install development package

`npm i -s @tarantool.io/frontend-core`

### Part of webpack config example

```
  externals: {
    react: 'react',
    'react-dom': 'reactDom'
  },
```

### Bundle to lua

We use plugin to bundle our static as Lua. Check it out here: https://github.com/tarantool/lua-bundler-webpack-plugin

# Boilerplate 

Stub project: https://github.com/tarantool/frontend-stub
