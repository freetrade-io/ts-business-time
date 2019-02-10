#!make

define with_nvm
	bash -l -c 'nvm exec $(NODE_VERSION) $(1)'
endef

node_modules: package.json
	$(call with_nvm,yarn install || npm install)

dist: node_modules $(shell find src -type f) prettier
	$(call with_nvm,./node_modules/.bin/tsc)

.PHONY: prettier
prettier:
	$(call with_nvm,./node_modules/.bin/prettier ./src/**/*.ts ./tests/**/*.ts --write)
	# Fix Prettier bug with ;
	sed -i 's/;\[/[/g' ./src/constraint/RangeConstraint.ts

.PHONY: test
test: node_modules
	$(call with_nvm,./node_modules/.bin/tslint src/**/*.ts tests/**/*.ts)
	$(call with_nvm,./node_modules/.bin/rimraf ./dist/)
	$(call with_nvm,./node_modules/.bin/jest)
