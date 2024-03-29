local t = require('luatest')
local g = t.group()
local fun = require('fun')
local http = require('http.server')
local http_cli = require('http.client')
local front = require('frontend-core')

g.before_all(function()
    g.httpd = http.new('0.0.0.0', 8080)
    g.httpd:start()
end)

local function cleanup_httpd()
    g.httpd.routes = {}
end

g.before_each(function()
    cleanup_httpd()
end)

g.after_all(function()
    g.httpd:stop()
end)

function g.test_broken_init()
    t.assert_error_msg_contains(
        "bad argument #1 to frontend-core.init (table expected, got nil)",
        front.init
    )

    t.assert_error_msg_contains(
        "bad argument #2 to frontend-core.init (?table expected, got number)",
        front.init, g.httpd, 5
    )

    t.assert_error_msg_contains(
        "bad argument options.enforce_root_redirect" ..
        " to frontend-core.init (?boolean expected, got number)",
        front.init, g.httpd, {enforce_root_redirect = 5}
    )

    t.assert_error_msg_contains(
        "bad argument options.prefix" ..
        " to frontend-core.init (?string expected, got number)",
        front.init, g.httpd, {prefix = 5}
    )
end

function g.test_init_without_prefix()
    local ok = front.init(g.httpd)
    t.assert_equals(ok, true)

    local paths = fun.map(function(r) return r.path end, g.httpd.routes):totable()
    t.assert_items_equals(paths, {
        "/static/:namespace/*filename",
        "/admin/*any",
        "/admin",
        "/",
    })

    local resp = http_cli.request('GET', 'localhost:8080')
    t.assert_equals(resp.status, 200)
    t.assert(resp.body)

    -- disable redirections
    cleanup_httpd()
    local ok = front.init(g.httpd, {enforce_root_redirect = false})
    t.assert_equals(ok, true)

    local paths = fun.map(function(r) return r.path end, g.httpd.routes):totable()
    t.assert_items_equals(paths, {
        "/static/:namespace/*filename",
        "/admin/*any",
        "/admin",
    })

    local resp = http_cli.request('GET', 'localhost:8080')
    t.assert_equals(resp.status, 200)
    t.assert_not(resp.body)
end

function g.test_init_custom_prefix()
    local ok = front.init(g.httpd, {prefix = '/tarantool'})
    t.assert_equals(ok, true)

    local paths = fun.map(function(r) return r.path end, g.httpd.routes):totable()
    t.assert_items_equals(paths, {
        "/tarantool/static/:namespace/*filename",
        "/tarantool/admin/*any",
        "/tarantool/admin",
        "/tarantool",
        "/",
    })

    -- check redirection works
    local resp = http_cli.request('GET', 'localhost:8080')
    t.assert_equals(resp.status, 200)
    t.assert(resp.body)

    local resp = http_cli.request('GET', 'localhost:8080/tarantool')
    t.assert_equals(resp.status, 200)
    t.assert(resp.body)


    -- disable redirections
    cleanup_httpd()
    local ok = front.init(g.httpd, {enforce_root_redirect = false, prefix = '/tarantool'})
    t.assert_equals(ok, true)

    local paths = fun.map(function(r) return r.path end, g.httpd.routes):totable()
    t.assert_items_equals(paths, {
        "/tarantool/static/:namespace/*filename",
        "/tarantool/admin/*any",
        "/tarantool/admin",
    })

    local resp = http_cli.request('GET', 'localhost:8080')
    t.assert_equals(resp.status, 200)
    t.assert_not(resp.body)
end
