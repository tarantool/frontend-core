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


local data_a = {
    ["main.example.js"] = {
        ["body"] = "console.log('Space A loaded')",
        ["mime"] = "application/javascript",
        ["is_entry"] = true
   }
}

local data_b = {
    ["main.example.js"] = {
        ["body"] = "console.log('Space B loaded')",
        ["mime"] = "application/javascript",
        ["is_entry"] = true
    }
}

local function test_loaded_scripts(expected_scripts)
    local resp = http_cli.request('GET', 'localhost:8080')
    if resp.status ~= 200 then
        error(('Response failed status %d'):format(resp.status), 2)
    elseif not resp.body then
        error('Bad response body is empty', 2)
    end

    -- base loaded srcipt (use '[hash]' string instead of original hash value)
    table.insert(expected_scripts, 1, '/tarantool/static/core/core.[hash].js')

    local loaded_arr, loaded_map = {}, {}
    for loaded_script in resp.body:gmatch('<script src=%s*(.-)>') do
        local decoded_name = json.decode(loaded_script):gsub('core%..*%.js', 'core.[hash].js')
        table.insert(loaded_arr, decoded_name)
        loaded_map[decoded_name] = true
    end

    local founded = true
    for _, expected_script in pairs(expected_scripts) do
        if not loaded_map[expected_script] then
            founded = false
            break
        end
    end

    if not founded then
        local errmsg = string.format(
            'Expected modules:\n - %s\nIncluded in loaded:\n - %s',
            table.concat(expected_scripts, '\n - '),
            table.concat(loaded_arr, '\n - ')
        )
        error(errmsg, 2)
    end
end


function g.test_modules_functionality()
    test_loaded_scripts({})

    -- Test bad arguments
    t.assert_error_msg_contains(
        'Bad argument #1 to add (string expected, got number)',
        front.add, 5
    )
    t.assert_error_msg_contains(
        'Bad argument #2 to add (table expected, got number)',
        front.add, 'namespace', 5
    )
    t.assert_error_msg_contains(
        'Bad argument #3 to add (?boolean expected, got number)',
        front.add, 'namespace', data_a, 5
    )

    -- Test for add modules
    local ok, err = front.add('space_a', data_a)
    t.assert_equals(err, nil)
    t.assert_equals(ok, true)

    local ok, err = front.add('space_b', data_b)
    t.assert_equals(err, nil)
    t.assert_equals(ok, true)

    -- Test adding existing module
    local ok, err = front.add('space_a', data_a)
    t.assert_equals(ok, nil)
    t.assert_equals(err, 'Front module "space_a" already added')

    local ok, err = front.add('space_a', data_a, true)
    t.assert_equals(err, nil)
    t.assert_equals(ok, true)

    -- Check that html page contains new modules
    test_loaded_scripts({
        "/tarantool/static/space_a/main.example.js",
        "/tarantool/static/space_b/main.example.js",
    })

    -- Test reove modules
    t.assert_error_msg_contains(
        'Bad argument #1 to remove (string expected, got number)',
        front.remove, 5
    )

    local ok, err = front.remove('nothing')
    t.assert_equals(ok, nil)
    t.assert_equals(err, 'Front module "nothing" not exists')

    local ok, err = front.remove('space_a')
    t.assert_equals(err, nil)
    t.assert_equals(ok, true)
    test_loaded_scripts({"/tarantool/static/space_b/main.example.js"})
end
