.PHONY: all install

all: $(shell find packages/core/src -type f) packages/core/node_modules
	npm run build --prefix packages/core/

packages/core/node_modules: packages/core/package.json
	npm ci --prefix packages/core/
	@ touch $@

install:
	mkdir -p $(INST_LUADIR)/frontend-core/
	cp packages/core/build/bundle.lua $(INST_LUADIR)/frontend-core/bundle.lua
