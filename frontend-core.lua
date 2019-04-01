#!/usr/bin/env tarantool

local checks = require('checks')
local core_bundle = require('frontend-core.bundle')

local index_body = nil
local modules = {
    -- [1] = namespace
    -- [namespace] = filemap
}

local function index_handler(req)
    if index_body == nil then
        local entries = {}
        for _, namespace in ipairs(modules) do
            for filename, file in pairs(modules[namespace]) do
                if file.is_entry then
                    table.insert(entries,
                        string.format('<script src="/static/%s/%s"></script>', namespace, filename)
                    )
                end
            end
        end

        index_body =
            '<!doctype html>' ..
            '<html>' ..
                '<head>' ..
                    '<title>Tarantool Enterprise</title>'..
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

local function static_handler(req)
    local namespace = modules[req:stash('namespace')]
    local file = namespace and namespace[req:stash('filename')]

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
    checks('string', 'table')

    if modules[namespace] ~= nil then
        return nil, string.format('Front module %q already added', namespace)
    end

    table.insert(modules, namespace)
    modules[namespace] = filemap
    -- invalidate cached index_body
    index_body = nil
    return true
end

local function init(httpd)
    checks('table')

    httpd:route({
        path = '/static/:namespace/*filename',
        method = 'GET',
    }, static_handler)

    httpd:route({
        path = '/admin',
        method = 'GET',
    }, index_handler)

    httpd:route({
        path = '/admin/*any',
        method = 'GET',
    }, index_handler)

    httpd:route({
        path = '/',
        method = 'GET',
    }, function (cx)
        return cx:redirect_to('/admin')
    end)

    add('core', core_bundle)
    return true
end

return {
    init = init,
    add = add,
}
