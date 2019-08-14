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

front.init(httpd)
-- front.add('module_one', require('module_one.bundle'))
-- front.add('module_two', require('module_two.bundle'))

