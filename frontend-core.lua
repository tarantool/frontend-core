#!/usr/bin/env tarantool

local json = require('json')
local core_bundle = require('frontend-core.bundle')

local index_body = nil
local modules = {
    -- [1] = namespace
    -- [namespace] = filemap
}
local variables = {}
local prefix = ''

local function index_handler(_)
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
                        string.format(
                            '<script src="%s/static/%s/%s"></script>',
                            prefix, namespace, filename
                        )
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
                    ('window.__tarantool_admin_prefix = %q;'):format(prefix)..
                    ('window.__tarantool_variables = %s;'):format(json.encode(variables))..
                    '</script>'..
                '</head>' ..
                '<body>' ..
                    '<div id="root"></div>' ..
                    table.concat(entries) ..
                    '<script>window.tarantool_enterprise_core.install()</script>'..
                '</body>' ..
            '</html>'
    end

    return {
        status = 200,
        headers = {['content-type'] = 'text/html; charset=utf8'},
        body = index_body
    }
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
            ['cache-control'] = 'max-age=86400',
        },
    }
end

local function add(namespace, filemap, replace)
    if type(namespace) ~= 'string' then
        error('Bad argument #1 to add' ..
            ' (string expected, got ' .. type(namespace) .. ')', 2)
    end
    if type(filemap) ~= 'table' then
        error('Bad argument #2 to add' ..
            ' (table expected, got ' .. type(filemap) .. ')', 2)
    end
    if replace ~= nil and type(replace) ~= 'boolean' then
        error('Bad argument #3 to add' ..
            ' (?boolean expected, got ' .. type(replace) .. ')', 2)
    end

    if modules[namespace] ~= nil and replace ~= true then
        return nil, string.format('Front module %q already added', namespace)
    elseif modules[namespace] == nil then
        table.insert(modules, namespace)
    end

    modules[namespace] = filemap
    -- invalidate cached index_body
    index_body = nil
    return true
end

local function remove(namespace)
    if type(namespace) ~= 'string' then
        error('Bad argument #1 to remove' ..
            ' (string expected, got ' .. type(namespace) .. ')', 2)
    end

    if modules[namespace] == nil then
        return nil, string.format('Front module %q not exists', namespace)
    end

    modules[namespace] = nil

    for i, mod_name in ipairs(modules) do
        if mod_name == namespace then
            table.remove(modules, i)
            break
        end
    end

    -- invalidate cached index_body
    index_body = nil
    return true
end

local function set_variable(name, value)
    if type(name) ~= 'string' then
        error('Bad argument #1 to set_variable' ..
            ' (string expected, got ' .. type(name) .. ')', 2)
    end
    variables[name] = value
    -- invalidate cached index_body
    index_body = nil
    return true
end

local function redirect(cx)
    return cx:redirect_to(prefix .. '/admin')
end

local function init(httpd, options)
    if type(httpd) ~= 'table' then
        local err = string.format(
            "bad argument #1 to frontend-core.init" ..
            " (table expected, got %s)", type(httpd)
        )
        error(err, 2)
    end
    if options == nil then
        options = {}
    elseif type(options) ~= 'table' then
        local err = string.format(
            "bad argument #2 to frontend-core.init" ..
            " (?table expected, got %s)", type(options)
        )
        error(err, 2)
    end

    local enforce_root_redirect
    if options.enforce_root_redirect == nil then
        enforce_root_redirect = true
    elseif type(options.enforce_root_redirect) ~= 'boolean' then
        local err = string.format(
            "bad argument options.enforce_root_redirect" ..
            " to frontend-core.init (?boolean expected, got %s)",
            type(options.enforce_root_redirect)
        )
        error(err, 2)
    else
        enforce_root_redirect = options.enforce_root_redirect
    end

    if options.prefix == nil then
        prefix = ''
    elseif type(options.prefix) ~= 'string' then
        local err = string.format(
            "bad argument options.prefix" ..
            " to frontend-core.init (?string expected, got %s)",
            type(options.prefix)
        )
        error(err, 2)
    else
        prefix = options.prefix
    end

    httpd:route({
        path = prefix .. '/static/:namespace/*filename',
        method = 'GET',
    }, static_handler)

    httpd:route({
        path = prefix .. '/admin',
        method = 'GET',
    }, index_handler)

    httpd:route({
        path = prefix .. '/admin/*any',
        method = 'GET',
    }, index_handler)

    if enforce_root_redirect then
        httpd:route({
            path = '/',
            method = 'GET',
        }, redirect)

        if prefix ~= '' then
            httpd:route({
                path = prefix,
                method = 'GET',
            }, redirect)
        end
    end

    index_body = nil

    add('core', core_bundle)
    return true
end

return {
    init = init,
    add = add,
    remove = remove,
    set_variable = set_variable
}
