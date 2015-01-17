JS_SRC_FILES := $(shell find js/app -type f -name '*.js')

docs: $(JS_SRC_FILES)
	jsdoc -r js/app -d docs/html \
	  -t node_modules/ink-docstrap/template \
	  -c docs/config.json

clean:
	rm -rf docs/html
