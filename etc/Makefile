NO_COLOR=\x1b[0m
OK_COLOR=\x1b[32;01m
ERROR_COLOR=\x1b[31;01m
WARN_COLOR=\x1b[33;01m

OK_STRING=$(OK_COLOR)[OK]$(NO_COLOR)
ERROR_STRING=$(ERROR_COLOR)[ERRORS]$(NO_COLOR)
RUN_STRING=$(WARN_COLOR)[RUN]$(NO_COLOR)

ROOT = .
CSS = '$(ROOT)/assets/css'
JS = '$(ROOT)/assets/js'
BUILD = '$(ROOT)/assets/build'

all: clean create css js

clean:
	rm -f -R $(BUILD)
	@echo "$(OK_STRING) Clean build"

create: clean
	mkdir $(BUILD)
	@echo "$(OK_STRING) Create build"

css: create
	@echo "$(RUN_STRING) Compiling CSS"
	awk 'FNR==1{print ""}1' $(CSS)/*.css > $(BUILD)/main.css
	csso $(BUILD)/main.css $(BUILD)/main.css
	@echo "$(OK_STRING) CSS compiled"

js: create
	@echo "$(RUN_STRING) Compiling JS"
	awk 'FNR==1{print ""}1' $(JS)/*.js > $(BUILD)/main.js
	uglifyjs $(BUILD)/main.js -o $(BUILD)/main.js
	@echo "$(OK_STRING) JS compiled"