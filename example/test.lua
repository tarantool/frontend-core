#!/usr/bin/env tarantool

httpd = require('http.server').new('0.0.0.0', '5050')
front = require('front')

front.http_regsiter(httpd)

httpd:start()
