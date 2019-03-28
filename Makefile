.PHONY: all install

all: node_modules
	npm run build

node_modules: package.json
	npm ci
	@ touch $@

install:
	mkdir -p $(INST_LUADIR)/front/
	cp build/bundle.lua $(INST_LUADIR)/front/bundle.lua
