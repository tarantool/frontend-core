package = 'frontend-core'
version = 'scm-1'
source  = {
    url = 'git+ssh://git@gitlab.com:tarantool/enterprise/enterprise-frontend-core.git',
    branch = 'master',
}
dependencies = {
    'lua >= 5.1',
}
build = {
    type = 'make';
    install = {
        lua = {
            ['pack-front'] = 'pack-front.lua',
            ['frontend-core'] = 'frontend-core.lua',
            -- ['frontend-core.bundle'] -- installed with make
        },
    },
    install_variables = {
        INST_LUADIR="$(LUADIR)",
    },

}
