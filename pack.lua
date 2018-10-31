#!/usr/bin/env tarantool
local log = require('log')
local fio = require('fio')
local json = require('json')

local src_json = arg[1]
local dst_name = arg[2]

if not src_json or not dst_name then
    error('Usage: pack.lua SOURCE.json DEST_NAME')
end

local abspath = fio.abspath(src_json)
assert(fio.stat(abspath), 'Error: can not pack %s: file does not exist')

log.info('-- Pack %s', abspath)
local f = io.open(abspath, "r")
local file_body = f:read('*a')
f:close()

log.info('Linearize')

local result = string.format([[[%q] = %q]], 'json', file_body)


log.info('-- Save %s', dst_name)

local function mod()
    return files
end

local first_str = 'local json = require("json")'

local end_strings = 'return json.decode(file.json)'

local mod_str = string.format('%s\nlocal file = {\n%s\n}\n%s', first_str, result, end_strings)
log.info('Total: %.0f KiB', (#mod_str)/1024)

local f = assert(io.open(dst_name, "wb"))
assert(f:write(mod_str))
assert(f:close())
os.exit(0)
