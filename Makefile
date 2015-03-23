BIN = ./node_modules/.bin
BUILD_DIR = ./build
STYLE_DIR = ./styles

install:
	-@npm install
	-@$(BIN)/bower install

update:
	-@npm update
	-@$(BIN)/bower update

less:
	-@$(BIN)/lessc $(STYLE_DIR)/index.less $(BUILD_DIR)/css/index.css --source-map $(BUILD_DIR)/css/main.css

lint:
	-@$(BIN)/gulp lint

run:
	-@$(BIN)/gulp

clean:
	-rm -rf build

build:
	-@$(BIN)/gulp less
	-@$(BIN)/gulp js
	-@$(BIN)/gulp images

.PHONY: install update less lint run clean
