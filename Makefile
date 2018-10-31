.PHONY: all install

all: node_modules
	npm run build

node_modules: package.json
	npm install
	@ touch $@

install:
	tarantool pack.lua build/bundle.json build/bundle.lua
	mkdir -p $(INST_LUADIR)/front/
	cp build/bundle.lua $(INST_LUADIR)/front/bundle.lua
