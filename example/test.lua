#!/usr/bin/env tarantool

httpd = require('http.server').new('0.0.0.0', '5050')
front = require('front')
super_test = require('super-test')
front.register_module('super-test', super_test)
front.http_regsiter(httpd)


httpd:start()
