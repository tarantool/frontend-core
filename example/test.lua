#!/usr/bin/env tarantool

httpd = require('http.server').new('0.0.0.0', '5050')
front = require('front')
my_cluster = require('my-cluster')
front.register_module('my-cluster', my_cluster)
front.http_regsiter(httpd)


httpd:start()
