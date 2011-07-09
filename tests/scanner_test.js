function testIsLineTerminator() {
  assertTrue(isLineTerminator("\n"));
  assertTrue(isLineTerminator("\r\n"));
  assertTrue(isLineTerminator("\r"));
  assertTrue(isLineTerminator("\u2028"));
  assertTrue(isLineTerminator("\u2029"));
  assertTrue(isLineTerminator("/*\n*/"));
  assertTrue(isLineTerminator("/*foo\n*/"));
  assertTrue(isLineTerminator("/*foo\nbar\nbaz*/"));
  assertFalse(isLineTerminator(" "));
  assertFalse(isLineTerminator("\x85"));
  assertFalse(isLineTerminator("\t"));
  assertFalse(isLineTerminator("/*foo*/"));
  assertFalse(isLineTerminator("'\\\n'"));
  assertFalse(isLineTerminator("'foo\\\nbar'"));
  assertFalse(isLineTerminator("/\\\n/"));
  assertFalse(isLineTerminator("/\\\n/"));
  assertFalse(isLineTerminator("\\\n"));
  assertFalse(isLineTerminator(""));
  assertFalse(isLineTerminator("42"));
}

function assertLexed(input, var_args_tokens) {
  var goldenTokens = [].slice.call(arguments, 1);
  var actualTokens = [];
  var scanner = makeScanner(input);
  for (var token; (token = scanner());) {
    actualTokens.push(token);
  }
  assertEquals(JSON.stringify(goldenTokens), JSON.stringify(actualTokens));
}

function testHelloWorld() {
  assertLexed("Hello, World!;", "Hello", ",", " ", "World", "!", ";");
}

// Derived from similarly named file under caja tests/com/google/caja/lexer/
var LEXER_TEST_INPUT_1 = "\
// a file to test the javascript lexer\n\
\n\
var i = 1 + 1;\n\
i = 1+1;\n\
i = 1 +1;  \n\
i = 1+-1;\n\
i = 1 - -1;\n\
\n\
'a string constant';\n\
s = 'a string that \\\n\
spans multiple physical lines \\\n\
but not logical ones';\n\
'a string with \"double quotes\" inside and ' +\n\
'a string with an escaped \\' inside';\n\
{'a string with multiple escaped \\\\characters\\' inside'};\n\
var s = \"double quotes work inside strings too.\\\n\
pretty well actually\";\n\
\n\
/* multiline comments have\n\
   no need for line continuation silliness */\n\
\n\
/*/ try and confuse the lexer\n\
    with a star-slash before\n\
    the end of the comment.\n\
 */\n\
\n\
/* comments can have embedded \"strings\" */\n\
\"and /*vice-versa*/ \"\n\
\n\
we(need - to + {{{test punctuation thoroughly}}});\n\
\n\
left <<= shift_amount;\n\
\n\
14.0005e-6 is one token?\n\
\n\
// check that exponentials with signs extracted properly during splitting\n\
var num = 1000-1e+2*2;\n\
\n\
// check that dotted identifiers split, but decimal numbers not.\n\
foo.bar = 4.0;\n\
foo2.bar = baz;\n\
\n\
.5  // a numeric token\n\
\n\
// test how comments affect punctuation\n\
1+/*\n\
*/+2;\n\
// should parse as 1 + + 2, not 1 ++ 2;\n\
foo/*\n\
*/bar;\n\
\n\
elipsis...;\n\
\n\
/* and extending the example at line 30 \" interleaved */ \" */\\\n\
\"also /* \" /* */\n\
\n\
// Backslashes in character sets do not end regexs.\n\
r = /./, /\\//, /[/]/, /[\\/]\\//\n\
\n\
isNaN(NaN);\n\
\n\
// leave some whitespace at the end of this file  \n\
\n\
                         ";

function testLexer1() {
  assertLexed(
    LEXER_TEST_INPUT_1,
    "// a file to test the javascript lexer", "\n", "\n",
    "var", " ",
    "i", " ",
    "=", " ",
    "1", " ",
    "+", " ",
    "1",
    ";", "\n",
    "i", " ",
    "=", " ",
    "1",
    "+",
    "1",
    ";", "\n",
    "i", " ",
    "=", " ",
    "1", " ",
    "+",
    "1",
    ";", "  ", "\n",
    "i", " ",
    "=", " ",
    "1",
    "+",
    "-",
    "1",
    ";", "\n",
    "i", " ",
    "=", " ",
    "1", " ",
    "-", " ",
    "-",
    "1",
    ";", "\n", "\n",
    "'a string constant'",
    ";", "\n",
    "s", " ",
    "=", " ",
    "'a string that \\\nspans multiple physical lines \\\nbut not logical ones'",
    ";", "\n",
    "'a string with \"double quotes\" inside and '", " ",
    "+", "\n",
    "'a string with an escaped \\' inside'",
    ";", "\n",
    "{",
    "'a string with multiple escaped \\\\characters\\' inside'",
    "}",
    ";", "\n",
    "var", " ",
    "s", " ",
    "=", " ",
    "\"double quotes work inside strings too.\\\npretty well actually\"",
    ";", "\n", "\n",
    "/* multiline comments have\n   no need for line continuation silliness */",
    "\n", "\n",
    "/*/ try and confuse the lexer\n    with a star-slash before"
    + "\n    the end of the comment.\n */", "\n", "\n",
    "/* comments can have embedded \"strings\" */", "\n",
    "\"and /*vice-versa*/ \"", "\n", "\n",
    "we",
    "(",
    "need", " ",
    "-", " ",
    "to", " ",
    "+", " ",
    "{",
    "{",
    "{",
    "test", " ",
    "punctuation", " ",
    "thoroughly",
    "}",
    "}",
    "}",
    ")",
    ";", "\n", "\n",
    "left", " ",
    "<<=", " ",
    "shift_amount",
    ";", "\n", "\n",
    "14.0005e-6", " ",
    "is", " ",
    "one", " ",
    "token",
    "?", "\n", "\n",
    "// check that exponentials with signs extracted properly during splitting",
    "\n",
    "var", " ",
    "num", " ",
    "=", " ",
    "1000",
    "-",
    "1e+2",
    "*",
    "2",
    ";", "\n", "\n",
    "// check that dotted identifiers split, but decimal numbers not.", "\n",
    "foo",
    ".",
    "bar", " ",
    "=", " ",
    "4.0",
    ";", "\n",
    "foo2",
    ".",
    "bar", " ",
    "=", " ",
    "baz",
    ";", "\n", "\n",
    ".5", "  ",
    "// a numeric token", "\n", "\n",
    "// test how comments affect punctuation", "\n",
    "1",
    "+",
    "/*\n*/",
    "+",
    "2",
    ";", "\n",
    "// should parse as 1 + + 2, not 1 ++ 2;", "\n",
    "foo",
    "/*\n*/",
    "bar",
    ";", "\n", "\n",
    "elipsis",
    ".",
    ".",
    ".",
    ";", "\n", "\n",
    "/* and extending the example at line 30 \" interleaved */", " ",
    "\" */\\\n\"",
    "also", " ",
    "/* \" /* */", "\n", "\n",
    "// Backslashes in character sets do not end regexs.", "\n",
    "r", " ",
    "=", " ",
    "/./",
    ",", " ",
    "/\\//",
    ",", " ",
    "/[/]/",
    ",", " ",
    "/[\\/]\\//", "\n", "\n",
    "isNaN",
    "(",
    "NaN",
    ")",
    ";", "\n", "\n",
    "// leave some whitespace at the end of this file  ", "\n", "\n",
    "                         ");
}