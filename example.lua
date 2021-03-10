#!/usr/bin/env tarantool

local log = require('log')
local http = require('http.server')
local front = require('frontend-core')

-- Sample bundle
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
-- Sample bundle end

local httpd = http.new(
  '0.0.0.0', 8080,
  { log_requests = true }
)
httpd:start()

local srv_name = httpd.tcp_server:name()
log.info('Listening HTTP on %s:%s', srv_name.host, srv_name.port)

front.init(httpd, {
  enforce_root_redirect = true,
  prefix = '/tarantool',
})
front.add('space_a', data_a)
front.add('space_a', data_b)
front.add('space_b', data_b)
front.remove('space_b')
front.set_variable('var1', 'value1')
front.set_variable('var2', 42)
front.set_variable('var3', { 1, 2, 3, 'a', 'b', 'c' })
front.set_variable('var4', { a = 'a', b = 'b', c = 'c' })
front.set_variable('var5', [[ !@#$%^&*(\/)"'.,><? ]])

