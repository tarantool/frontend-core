# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [8.2.0 - 8.2.1]

- Update dependencies.
- Update github workflows.

## [8.1.2]

- Remove jsdom dependencies in the main code.

## [8.1.0 - 8.1.1]

- Update `@tarantool.io/ui-kit` version to ^0.51.1
- Update dependencies to fix audit issues.

## [8.0.5]

- Update `@tarantool.io/ui-kit` version to ^0.50.10

## [8.0.4]

- Update `@tarantool.io/ui-kit` version to ^0.50.9

## [8.0.3]

- Update `@tarantool.io/ui-kit` version to ^0.50.7

## [8.0.2]

- Add the `core:updateReactTreeKey` dispatch event to be able to force re-render the React tree.

## [8.0.1]

- Update `@tarantool.io/ui-kit` version to ^0.50.4

## [8.0.0]

- Add to core the ability to work with localsStorage and sessionStorage;
- Memorize the opening states of the side menu in sessionStorage;
- Add the ability to use core as an npm module;
- Add react hook useCore and HOC withCore to access core inside components;

## [7.12.1]

- Add typescript types;

## [7.12.0]

- Update dependencies to support the new branding style;
- Update assets icons;

## [7.11.0]

- Update dependencies;
- Update prettier and eslint configurations;
- Lock `react` and `react-dom` to `^16.14.0` version;

## [7.10.0]

- Pass menu subitems to filtering

## [7.9.1]

- Fix notification list bug

## [7.9.0]

- Update notifications.
- Update deps.

## [7.8.0]

- Invalidate `index_body` cache in case of re-init.
- Make error messages more clear.
- Enhance options validation.
- Add redirection to `prefix/admin` for route that equals `prefix`

## [7.7.0]

- Updated Tarantool favicon.

- Updated popup notifications.

- Updated vulnerable dependencies.

## [7.6.0]

- `replace` and `remove` features in lua for exists front-end modules.

## [7.5.0]

- Used z-index from UI-Kit in NotificationList.

## [7.4.0]

- Removed Open Sans font, antd and another unused code parts
- Used AppLayout & AppHeader from UI-Kit

## [7.3.0]

- Used Breadcrumbs from UI-Kit
- Updated side menu and logo

## [7.2.0]

- Showing app name in window title
- Added markdown in notification details

## [7.1.0]

- Remove base64 inline Roboto fonts & add Inter font
- Update set title when change location
- Passing data to frontend with `front.set_variable()`
- Introduced `@tarantool.io/ui-kit`
- Added `details` prop to notifications

## [7.0.0]

- Register in DOM only in Lua part, remove it from npm module part. You should use install method.
- Remove nanoid package because of weird webpack build
- Remove engine code from Core (but save as args for compatibility)
- Add registerModule method and deprecate method register

## [6.5.1]

- Fix routes mapping
- Update react version to 16.13.1

## [6.5.0] - 2020-04-13

- Add cache-control http header for /static route
- Fixed state where could be more than one selected menu items.
- Refactor filter API
- Before showing, each route is passed through filtering
- Application name heading

## [6.4.0] - 2020-03-17

- Customizable route prefix
- Add optional priority to network events handlers

## [6.3.0] - 2020-01-24

- Fix side menu bug in Safari
- Update MenuItem component
- Change Apollo handlers: `afterware` handles successful responses and `onError` handles errors.
- Add analytic module

## [6.2.0] - 2019-11-19

- Add deduplication to active notifications
- Add API Methods for single HTTP Configuration
- Add way to filter menu items

## [6.1.1]

- Remove from npm version useless files

## [6.1.0]

- Save notifications to local storage
- Fix notifications hours display
- Change notifications journal order to by time descending
- Update ANT.D version
- Add favicon (working in Chrome and Firefox)
- Add Cyrillic Open-Sans ligatures

## [6.0.2]

- Change eslint to standard
- Fix favicon to core

## [6.0.1]

- Add favicon

## [6.0.0]

- Add title in app header and sets window title.
- Fix side menu bug because of it subitems couldn't be rendered as selected.
- Change behaviour of menu expand
- Redesign UI
- Add notify method for notification
- Deprecate usage of `setHeaderComponent`

## [5.0.2] - 2019-06-25

- Hide bundled data behind getter function.
  This is to avoid large output of `package.loaded` table.

## [5.0.1] - 2019-05-08

- Update ANT Design to 3.18.2

## [5.0.0] - 2019-05-08

- Add ANT Design to core and fonts

## [4.1.0] - 2019-04-30

- Added 'dispatchToken' event which transmits action object to core redux store.
- Fixed Menu with subitems crashes

## [4.0.1] - 2019-04-01

- Set proper doctype in index.html

## [4.0.0] - 2019-03-28

### Changed

- Rename rock to "frontend-core"
- Change base URI to /admin
- Remove burger
- Fix bugs
- Add setHeaderComponent

## [3.0.4] - 2019-02-18

### Fixed

- Upgrade react version and hooks

## [3.0.3] - 2019-01-30

### Fixed

- Improve layout
- Improve link detection

## [3.0.2] - 2019-01-21

### Fixed

- Minor design improvements

## [3.0.0] - 2018-12-20

### Changed

- Refactor lua api
- Pack static lua bundle during npm build

## [2.0.2] - 2018-12-13

Unstable intermediate release
