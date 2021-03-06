package = 'frontend-core'
version = 'scm-1'
source  = {
    url = 'git+https://github.com/tarantool/frontend-core.git',
    branch = 'master',
}
dependencies = {
    'lua >= 5.1',
}
build = {
    type = 'make';
    install = {
        lua = {
            ['frontend-core'] = 'frontend-core.lua',
            -- ['frontend-core.bundle'] -- installed with make
        },
    },
    install_variables = {
        INST_LUADIR="$(LUADIR)",
    },

}
