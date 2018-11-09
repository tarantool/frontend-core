# Tarantool Enterprise Front-end Core

It's core module for admin UI. Any UI submodules should be register at core.

It has two parts. Lua part as rock that will be used at your project. JS part that will be compiled at Lua bundle. JS part based on React.

## Architecture

### Javascript

It's based on CRA. But with some details. Core is just a little React app that can route to correct module.

It can register a module in any time and route to it. That's main purpose.

Module can be described by module namespace, react root component and menu description, which can be described in two way(about it later).

### Rock

Core module and other UI modules bundled as Lua file that contains bundle files.

```
tarantoolctl rock make
```

Command above

### Lua



## Obstacles

## Principle

## Routing
