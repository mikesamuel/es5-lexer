# ES5 Lexer

A lexical scanner for EcmaScript 5 that is as correct as one can be
(given the ambiguity between regular expressions and division ops)
and produces a token stream that will be treated as equivalent by
any valid EcmaScript parser that parses the output.

This is meant to efficiently allow token level transformations
of valid EcmaScript 5 programs from untrusted sources that will have
same meaning as that assumed by the transformer when parsed by a full
EcmaScript interpreter.  For this to hold, the output token stream
must not contain any ambiguity.

The resulting token stream will not have semicolons inserted into it,
and is not guaranteed to specify a valid EcmaScript program.

## Usage

This code is divided into several separate JavaScript files which are
meant to be combined before use.

Run

    $ make

from a UNIX shell to build the combined JS bundle which will be
avilable at `build/es5_lexer_combined.js`.

Once you've got an HTML page that loads your code, you can use

    var scanner = es5Lexer.makeScanner(sourceCode);

to create a token stream which is just a function that will return
the next token each time it is called or `null` if none are available.

     var unambiguousTokenStream = es5Lexer.disambiguateTokenStream(
        scanner);
    
produces a token stream that is unambiguous.

See `src/exports.js` for the full public API that incude other utility
functions for dealing with EcmaScript tokens.

Other usage examples are available in the unit tests under the
`tests/` directory.
