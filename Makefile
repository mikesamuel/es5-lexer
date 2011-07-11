RHINO=java -jar tools/rhino/js.jar

JS_SOURCES=\
  build/tokens.js \
  build/guess_is_regexp.js \
  build/scanner.js \
  build/disambiguate.js \
  build/exports.js

EXTERNS=--externs tools/closure/externs.js \
  --externs tools/closure/webkit_console.js

CLOSURE_COMPILER=java -jar tools/closure/compiler.jar \
   --compilation_level ADVANCED_OPTIMIZATIONS \
   --language_in ECMASCRIPT5

all: build/es5_lexer_compiled.js build/dogfood_test_bundle.js

clean:
	rm -rf build

build/es5_lexer_compiled.js: $(JS_SOURCES)
	@echo "$^" | perl -pe 's/(?:^|\s+)(\S)/ --js $$1/g' \
	| xargs $(CLOSURE_COMPILER) \
	    $(EXTERNS) \
	    --output_wrapper="(function(global){%output%}(this))" \
	    | perl -pe 's/\bwindow.//g; s/;\}/}/g' \
	    > "$@" \
	    || (rm "$@"; false)
	@echo Size of built bundle raw and gzipped.
	@gzip -c -9 "$@" > "$(TEMP)"/gzipped
	@wc -c "$@" "$(TEMP)"/gzipped

build/%.js: src/%.js
	@cp "$^" "$@"

# Run Rhino to precompute token RegExps which saves about 600ms at boot.
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

# Run Rhino to lex and disambiguate the compiled output.
build/dogfood_test_bundle.js: build/es5_lexer_compiled.js
	@echo Running Rhino to disambiguate the built version as a benchmark.
	@$(RHINO) -e "load('$^');" \
	  -e "var tokenStream = es5Lexer.disambiguateTokenStream( \
	        es5Lexer.makeScanner(readFile('$^', 'UTF-8')));" \
	  -e "var dogfood = [];" \
	  -e "for (var token; (token = tokenStream());) \
	        dogfood.push(token);" \
	  -e "print(dogfood.join(''));" \
	  > "$@"
	@echo Disambiguated version is \
	  $$(( $$(cat "$@" | wc -c) * 100 / $$(cat "$^" | wc -c) ))"%" \
	  of the size of the original.
