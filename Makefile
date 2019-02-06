node_modules: package.json
	yarn install || npm install

dist: node_modules $(shell find src -type f) prettier
	./node_modules/.bin/tsc

.PHONY: prettier
prettier:
	./node_modules/.bin/prettier ./src/**/*.ts ./tests/**/*.ts --write
	# Fix Prettier bug with ;
	sed -i 's/;\[/[/g' ./src/constraint/RangeConstraint.ts

.PHONY: test
test:
	./node_modules/.bin/tslint src/**/*.ts tests/**/*.ts
	./node_modules/.bin/rimraf ./dist/
	./node_modules/.bin/jest
