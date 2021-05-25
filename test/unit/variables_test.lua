local t = require('luatest')
local g = t.group()
local json = require('json')
local http = require('http.server')
local http_cli = require('http.client')
local front = require('frontend-core')

g.before_all(function()
    g.httpd = http.new('0.0.0.0', 8080)
    g.httpd:start()
    local ok = front.init(g.httpd, {prefix = '/tarantool'})
    t.assert_equals(ok, true)
end)

g.after_all(function()
    g.httpd:stop()
end)

function g.test_set_window_variables()
    local resp = http_cli.request('GET', 'localhost:8080')
    t.assert_equals(resp.status, 200)
    t.assert(resp.body)

    local window_prefix_str = resp.body:match(
        'window%.__tarantool_admin_prefix%s*=%s*(.-);'
    )
    t.assert(window_prefix_str)
    local window_prefix = json.decode(window_prefix_str)
    t.assert_equals(window_prefix, '/tarantool')

    local vars = {
        var1 = 'value1',
        var2 = 42,
        var3 = { 1, 2, 3, 'a', 'b', 'c' },
        var4 = { a = 'a', b = 'b', c = 'c' },
        var5 = [[ !@#$%^&*(\/)"'.,><? ]]
    }

    front.set_variable('var1', vars.var1)
    front.set_variable('var2', vars.var2)
    front.set_variable('var3', vars.var3)
    front.set_variable('var4', vars.var4)
    front.set_variable('var5', vars.var5)

    local resp = http_cli.request('GET', 'localhost:8080')
    local window_vars_str = resp.body:match(
        'window%.__tarantool_variables%s*=%s*(.-);'
    )
    local window_vars = json.decode(window_vars_str)
    t.assert_equals(window_vars, vars)
end
