package = "front"
version = "scm-1"
source  = {
    url = 'git+ssh://git@gitlab.com:tarantool/enterprise/front.git',
    branch = 'master',
}
dependencies = {
    'lua >= 5.1',
    'checks == 2.1.1-1',
}
build = {
    type = 'make';
    install = {
        lua = {
            ['front'] = 'front.lua',
            ['pack-front'] = 'pack-front.lua',
            -- ['front.bundle'] -- installed with make
        },
    },
    install_variables = {
        INST_LUADIR="$(LUADIR)",
    },

}
