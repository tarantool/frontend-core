#!/usr/bin/env tarantool

httpd = require('http.server').new('0.0.0.0', '5050')
front = require('front')
--module_one = require('module_one')
--front.module_register('module_one', module_one)
--module_two = require('module_two')
--front.module_register('module_two', module_two)
front.http_register(httpd)


httpd:start()
