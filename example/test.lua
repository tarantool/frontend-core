#!/usr/bin/env tarantool

httpd = require('http.server').new('0.0.0.0', '5050')
front = require('front')
front.init(httpd)
--module_one_bundle = require('module_one.bundle')
--front.add('module_one', module_one_bundle)
--module_two_bundle = require('module_two.bundle')
--front.add('module_two', module_two_bundle)

httpd:start()
