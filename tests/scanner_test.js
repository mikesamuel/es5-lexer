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

function testLexer2() {
  assertLexed(
      "function Pc(a,b){var c;if(b){c=new t(a)}else{a=new x("
      + "a.year,a.month,a.date,0,0,0);c=new t(a)}var d=[];var e;for(var f=0;"
      + "f<48;++f){e=of(c.d());if(b){if(f==0){e+=\" (0 minutes)\"}else "
      + "if(f==1){e+=\" (30 minutes)\"}else{"
      + "e+=\" (\"+f/2+\" hour\";e+=f==2?\")\":\"s)\"}}d.push(e);c.advance("
      + "_CB_HALF_HOUR)}return d}",

      "function", " ", "Pc", "(", "a", ",", "b", ")", "{", "var", " ", "c",
      ";", "if", "(", "b", ")", "{", "c", "=", "new", " ", "t", "(", "a", ")",
      "}", "else", "{", "a", "=", "new", " ", "x", "(",

      "a", ".", "year", ",", "a", ".", "month", ",", "a", ".", "date", ",", "0",
      ",", "0", ",", "0", ")", ";", "c", "=", "new", " ", "t", "(", "a", ")",
      "}", "var", " ", "d", "=", "[", "]", ";", "var", " ", "e", ";", "for", 
      "(", "var", " ", "f", "=", "0", ";",

      "f", "<", "48", ";", "++", "f", ")", "{", "e", "=", "of", "(", "c", ".",
      "d", "(", ")", ")", ";", "if", "(", "b", ")", "{", "if", "(", "f", "==",
      "0", ")", "{", "e", "+=", "\" (0 minutes)\"", "}", "else", " ",

      "if", "(", "f", "==", "1", ")", "{", "e", "+=", "\" (30 minutes)\"", "}",
      "else", "{",
      
      "e", "+=", "\" (\"", "+", "f", "/", "2", "+", "\" hour\"", ";", "e", "+=",
      "f", "==", "2", "?", "\")\"", ":", "\"s)\"", "}", "}", "d", ".", "push",
      "(", "e", ")", ";", "c", ".", "advance", "(",

      "_CB_HALF_HOUR", ")", "}", "return", " ", "d", "}");
}

function assertNext(lexer, token) {
  assertEquals(token, lexer());
}

function assertEmpty(lexer) {
  assertEquals(null, lexer());
}

function skipSpaces(lexer) {
  return function () {
    for (var token; (token = lexer());) {
      if (classifyToken(token) !== TokenType.WHITE_SPACE) { return token; }
    }
    return null;
  };
}

function testRegexLiterals() {
  var lexer = skipSpaces(makeScanner("foo.replace(/[A-Z]/g, '#')"));
  assertNext(lexer, "foo");
  assertNext(lexer, ".");
  assertNext(lexer, "replace");
  assertNext(lexer, "(");
  assertNext(lexer, "/[A-Z]/g");
  assertNext(lexer, ",");
  assertNext(lexer, "'#'");
  assertNext(lexer, ")");
  assertEmpty(lexer);
}

function testSimpleExpression() {
  var lexer = skipSpaces(makeScanner("while (foo) { 1; }"));
  assertNext(lexer, "while");
  assertNext(lexer, "(");
  assertNext(lexer, "foo");
  assertNext(lexer, ")");
  assertNext(lexer, "{");
  assertNext(lexer, "1");
  assertNext(lexer, ";");
  assertNext(lexer, "}");
  assertEmpty(lexer);
}

function testNumberDotWord() {
  var lexer = skipSpaces(makeScanner("0..toString()"));  // evaluates to "0"
  assertNext(lexer, "0.");
  assertNext(lexer, ".");
  assertNext(lexer, "toString");
  assertNext(lexer, "(");
  assertNext(lexer, ")");
  assertEmpty(lexer);
}

function testByteOrderMarkersAtBeginning() {
  var lexer = skipSpaces(makeScanner("\uFEFFvar foo"));
  assertNext(lexer, "var");
  assertNext(lexer, "foo");
  assertEmpty(lexer);
}

function testByteOrderMarkersBetweenTokens() {
  var lexer = skipSpaces(makeScanner("1.\uFEFF3"));
  assertNext(lexer, "1.");
  assertNext(lexer, "3");
  assertEmpty(lexer);
}

function testByteOrderMarkersInStrings() {
  var lexer = skipSpaces(makeScanner("'\uFEFF'"));
  assertNext(lexer, "'\uFEFF'");
  assertEmpty(lexer);
}

function testEmphaticallyDecremented() {
  var lexer = skipSpaces(makeScanner("i---j"));
  assertNext(lexer, "i");
  assertNext(lexer, "--");
  assertNext(lexer, "-");
  assertNext(lexer, "j");
  assertEmpty(lexer);
}

function testIsRegexpFollowingWord() {
  {
    var lexer = skipSpaces(makeScanner("min / max /*/**/"));
    assertNext(lexer, "min");
    assertNext(lexer, "/");
    assertNext(lexer, "max");
    assertNext(lexer, "/*/**/");
    assertEmpty(lexer);
  }
  {
    var lexer = skipSpaces(makeScanner("in / max /*/**/"));
    assertNext(lexer, "in");
    assertNext(lexer, "/ max /");
    assertNext(lexer, "*");
    assertNext(lexer, "/**/");
    assertEmpty(lexer);
  }
}

function testRegexpFollowingVoid() {
  var lexer = skipSpaces(makeScanner("void /./"));
  assertNext(lexer, "void");
  assertNext(lexer, "/./");
  assertEmpty(lexer);
}

/* KNOWN FAILURE
function testRegexpFollowingPreincrement() {
  var lexer = skipSpaces(makeScanner("x = ++/x/m"));
  assertNext(lexer, "x");
  assertNext(lexer, "=");
  assertNext(lexer, "++");
  assertNext(lexer, "/x/m");
  assertEmpty(lexer);
}
*/

function testRegexpFollowingPostincrement() {
  var lexer = skipSpaces(makeScanner("x++/y/m"));
  assertNext(lexer, "x");
  assertNext(lexer, "++");
  assertNext(lexer, "/");
  assertNext(lexer, "y");
  assertNext(lexer, "/");
  assertNext(lexer, "m");
  assertEmpty(lexer);
}
