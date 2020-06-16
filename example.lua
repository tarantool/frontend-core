#!/usr/bin/env tarantool

local log = require('log')
local http = require('http.server')
local front = require('frontend-core')

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
front.set_variable('var1', 'value1')
front.set_variable('var2', 42)
front.set_variable('var3', { 1, 2, 3, 'a', 'b', 'c' })
front.set_variable('var4', { a = 'a', b = 'b', c = 'c' })
front.set_variable('var5', [[ !@#$%^&*(\/)"'.,><? ]])

