#!/usr/bin/env tarantool

local checks = require('checks')

local bundle_core = require('front.bundle')

local front =  {}

local modules = {}
local modules_includes = {}
local files = {}
local entries = {}
local include_string = ''
local OPEN_BODY = [[
<html>
<head><title>Tarantool Enterprise</title></head>
<body>
<div id="root"></div>
]]

local CLOSE_BODY = [[
</body>
</html>
]]

local index_body = OPEN_BODY .. CLOSE_BODY

local STATIC_PATH = '/static'
local FRONT_PATH = '/front'

local index_handler = function(req)
    return {
        status = 200,
        headers = {['content-type'] = 'text/html; charset=utf8'},
        body = index_body
    }
end

local file_handler = function(req)
    print('static')
    local file_path = req.path:sub(#STATIC_PATH + 2 )
    print('file_path')
    print(file_path)
    if files[file_path] ~= nil then
        local file = files[file_path]
        return {
            status = 200,
            headers = { ['content-type'] = file.mime },
            body = file.body
        }
    end
    return {
        status = 404
    }
end

function front.http_regsiter(httpd)
    httpd:route({path = FRONT_PATH .. '/.*', }, index_handler)
    httpd:route({path = FRONT_PATH, }, index_handler)
    httpd:route({path = STATIC_PATH .. '/.*', }, file_handler)
    httpd:route({path = STATIC_PATH, }, file_handler)
    httpd:route({path = '/', }, function (cx) return cx:redirect_to(FRONT_PATH) end)
end

local function process_module(module)
    checks({namespace = 'string', filemap = 'table'})
    for filename, file in pairs(module.filemap) do

        local filename = module.namespace .. '/' .. filename
        files[ filename ] = file
        if file.is_entry then
            table.insert(entries, filename)
            local includes = ''
            for _, filename in ipairs(entries) do
                includes = includes .. '<script src="/static/' .. filename .. '"></script>'
            end
            include_string = includes
            index_body = OPEN_BODY .. include_string .. CLOSE_BODY
            print('index_body')
            print(include_string)
        end
    end
end

function front.register_module(namespace, filemap) -- return err, ok
    checks('string', 'table')
    if modules[namespace] ~= nil then
        return 'already_exists'
    end
    modules[namespace] = true
    local module = {namespace = namespace, filemap = filemap}
    table.insert(modules_includes, module)
    process_module(module)
end

-- generate filemap from json
function front.preprocess_module(bundle_path)

end

-- for user's mapping
function front.get_modules()
    return modules_includes
end

front.register_module('core', bundle_core)


return front
