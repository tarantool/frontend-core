#!/usr/bin/env tarantool

local core_bundle = require('frontend-core.bundle')
local json = require('json')

local index_body = nil
local modules = {
    -- [1] = namespace
    -- [namespace] = filemap
}

local function get_index_handler(options)
    return function(req)
        if index_body == nil then
            local entries = {}
            for _, namespace in ipairs(modules) do
                local mod = modules[namespace]

                local data
                if type(mod.__data) == 'function' then
                    data = mod.__data()
                else
                    data = mod
                end

                for filename, file in pairs(data) do
                    if file.is_entry then
                        table.insert(entries,
                            string.format('<script src="'..options.prefix..'/static/%s/%s"></script>', namespace, filename)
                        )
                    end
                end
            end

            index_body =
                '<!doctype html>' ..
                '<html>' ..
                    '<head>' ..
                        '<title>Tarantool Cartridge</title>'..
                        '<script>'..
                        'window.__tarantool_admin_prefix = '..json.encode(options.prefix)..
                        '</script>'..
                    '</head>' ..
                    '<body>' ..
                        '<div id="root"></div>' ..
                        table.concat(entries) ..
                    '</body>' ..
                '</html>'
        end

        return {
            status = 200,
            headers = {['content-type'] = 'text/html; charset=utf8'},
            body = index_body
        }
    end
end

local function static_handler(req)
    local mod = modules[req:stash('namespace')]
    if mod == nil then
        return { status = 404 }
    end

    local data
    if type(mod.__data) == 'function' then
        data = mod.__data()
    else
        data = mod
    end

    local file = data[req:stash('filename')]
    if file == nil then
        return { status = 404 }
    end

    return {
        status = 200,
        body = file.body,
        headers = {
            ['content-type'] = file.mime,
        },
    }
end

local function add(namespace, filemap)
    if type(namespace) ~= 'string' then
        error('Bad argument #1 to add' ..
            ' (string expected, got ' .. type(namespace) .. ')', 2)
    end
    if type(filemap) ~= 'table' then
        error('Bad argument #2 to add' ..
            ' (table expected, got ' .. type(filemap) .. ')', 2)
    end

    if modules[namespace] ~= nil then
        return nil, string.format('Front module %q already added', namespace)
    end

    table.insert(modules, namespace)
    modules[namespace] = filemap
    -- invalidate cached index_body
    index_body = nil
    return true
end

local function init(httpd, options)
    local options_ = {}

    if options ~= nil then
        options_ = options
    end

    local real_options = { prefix = '', enforce_root_redirect = true }

    for k, v in pairs(options_) do real_options[k] = v end

    local index_handler = get_index_handler(real_options)

    httpd:route({
        path = real_options.prefix .. '/static/:namespace/*filename',
        method = 'GET',
    }, static_handler)

    httpd:route({
        path = real_options.prefix .. '/admin',
        method = 'GET',
    }, index_handler)

    httpd:route({
        path = real_options.prefix .. '/admin/*any',
        method = 'GET',
    }, index_handler)

    if real_options.enforce_root_redirect then -- default true
        httpd:route({
            path = '/',
            method = 'GET',
        }, function (cx)
            return cx:redirect_to(real_options.prefix .. '/admin')
        end)
    end

    add('core', core_bundle)
    return true
end

return {
    init = init,
    add = add,
}
