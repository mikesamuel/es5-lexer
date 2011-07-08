RHINO=java -jar tools/rhino/js.jar

build/tokens.js: src/tokens.js
	@mkdir -p build
	@echo Running $^ in Rhino to produce $@
	@echo '/**' > "$@"
	@echo ' * @fileoverview RegExps defining EcmaScript lexical tokens.' \
	  >> "$@"
	@echo ' */' >> "$@"
	@$(RHINO) -w -strict -fatal-warnings \
	  -e "load('$^');" \
	  -e "print('var ES5_TOKEN=' + uneval(ES5_TOKEN) + ',');" \
	  -e "print('ES5_IGNORABLE_TOKEN_PREFIX=' \
	      + uneval(ES5_IGNORABLE_TOKEN_PREFIX)) + ';'" >> "$@"
