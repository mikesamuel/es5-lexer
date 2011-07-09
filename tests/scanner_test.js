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
  var k = 0;
  for (var token; (token = scanner());) {
    actualTokens[k++] = token;
    // Include the types of the tokens if the golden includes it.
    if ("number" === typeof goldenTokens[k]) {
      actualTokens[k++] = classifyToken(token);
    }
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
spans multiple physical lines \\\r\
but not logical ones';\n\
'a string with \"double quotes\" inside and ' +\n\
'a string with an escaped \\' inside';\n\
{'a string with multiple escaped \\\\characters\\' inside'};\n\
var s = \"double quotes work inside strings too.\\\r\n\
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
/* and extending the example at line 30 \" interleaved */ \" */\\\u2028\
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
    "'a string that \\\nspans multiple physical lines \\\rbut not logical ones'",
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
    "\"double quotes work inside strings too.\\\r\npretty well actually\"",
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
    "\" */\\\u2028\"",
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

function assertNext(lexer, token, tokenType) {
  assertEquals(token, lexer());
  assertEquals("number", typeof tokenType);
  assertEquals(tokenType, classifyToken(token));
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
  assertNext(lexer, "foo", TokenType.IDENTIFIER_NAME);
  assertNext(lexer, ".", TokenType.PUNCTUATOR);
  assertNext(lexer, "replace", TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "(", TokenType.PUNCTUATOR);
  assertNext(lexer, "/[A-Z]/g", TokenType.REGEXP_LITERAL);
  assertNext(lexer, ",", TokenType.PUNCTUATOR);
  assertNext(lexer, "'#'", TokenType.STRING_LITERAL);
  assertNext(lexer, ")", TokenType.PUNCTUATOR);
  assertEmpty(lexer);
}

function testSimpleExpression() {
  var lexer = skipSpaces(makeScanner("while (foo) { 1; }"));
  assertNext(lexer, "while", TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "(", TokenType.PUNCTUATOR);
  assertNext(lexer, "foo", TokenType.IDENTIFIER_NAME);
  assertNext(lexer, ")", TokenType.PUNCTUATOR);
  assertNext(lexer, "{", TokenType.PUNCTUATOR);
  assertNext(lexer, "1", TokenType.NUMERIC_LITERAL);
  assertNext(lexer, ";", TokenType.PUNCTUATOR);
  assertNext(lexer, "}", TokenType.PUNCTUATOR);
  assertEmpty(lexer);
}

function testNumberDotWord() {
  var lexer = skipSpaces(makeScanner("0..toString()"));  // evaluates to "0"
  assertNext(lexer, "0.", TokenType.NUMERIC_LITERAL);
  assertNext(lexer, ".", TokenType.PUNCTUATOR);
  assertNext(lexer, "toString", TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "(", TokenType.PUNCTUATOR);
  assertNext(lexer, ")", TokenType.PUNCTUATOR);
  assertEmpty(lexer);
}

function testByteOrderMarkersAtBeginning() {
  var lexer = skipSpaces(makeScanner("\uFEFFvar foo"));
  assertNext(lexer, "var", TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "foo", TokenType.IDENTIFIER_NAME);
  assertEmpty(lexer);
}

function testByteOrderMarkersBetweenTokens() {
  var lexer = skipSpaces(makeScanner("1.\uFEFF3"));
  assertNext(lexer, "1.", TokenType.NUMERIC_LITERAL);
  assertNext(lexer, "3", TokenType.NUMERIC_LITERAL);
  assertEmpty(lexer);
}

function testByteOrderMarkersInStrings() {
  var lexer = skipSpaces(makeScanner("'\uFEFF'"));
  assertNext(lexer, "'\uFEFF'", TokenType.STRING_LITERAL);
  assertEmpty(lexer);
}

function testEmphaticallyDecremented() {
  var lexer = skipSpaces(makeScanner("i---j"));
  assertNext(lexer, "i", TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "--", TokenType.PUNCTUATOR);
  assertNext(lexer, "-", TokenType.PUNCTUATOR);
  assertNext(lexer, "j", TokenType.IDENTIFIER_NAME);
  assertEmpty(lexer);
}

function testIsRegexpFollowingWord() {
  {
    var lexer = skipSpaces(makeScanner("min / max /*/**/"));
    assertNext(lexer, "min", TokenType.IDENTIFIER_NAME);
    assertNext(lexer, "/", TokenType.PUNCTUATOR);
    assertNext(lexer, "max", TokenType.IDENTIFIER_NAME);
    assertNext(lexer, "/*/**/", TokenType.COMMENT);
    assertEmpty(lexer);
  }
  {
    var lexer = skipSpaces(makeScanner("in / max /*/**/"));
    assertNext(lexer, "in", TokenType.IDENTIFIER_NAME);
    assertNext(lexer, "/ max /", TokenType.REGEXP_LITERAL);
    assertNext(lexer, "*", TokenType.PUNCTUATOR);
    assertNext(lexer, "/**/", TokenType.COMMENT);
    assertEmpty(lexer);
  }
}

function testRegexpFollowingVoid() {
  var lexer = skipSpaces(makeScanner("void /./"));
  assertNext(lexer, "void", TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "/./", TokenType.REGEXP_LITERAL);
  assertEmpty(lexer);
}

/* KNOWN FAILURE
function testRegexpFollowingPreincrement() {
  var lexer = skipSpaces(makeScanner("x = ++/x/m"));
  assertNext(lexer, "x", TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "=", TokenType.PUNCTUATOR);
  assertNext(lexer, "++", TokenType.PUNCTUATOR);
  assertNext(lexer, "/x/m", TokenType.REGEXP_LITERAL);
  assertEmpty(lexer);
}
*/

function testRegexpFollowingPostincrement() {
  var lexer = skipSpaces(makeScanner("x++/y/m"));
  assertNext(lexer, "x", TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "++", TokenType.PUNCTUATOR);
  assertNext(lexer, "/", TokenType.PUNCTUATOR);
  assertNext(lexer, "y", TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "/", TokenType.PUNCTUATOR);
  assertNext(lexer, "m", TokenType.IDENTIFIER_NAME);
  assertEmpty(lexer);
}

// TODO: parser tests from Caja.
// TODO: non-latin spaces.
// TODO: non-latin identifiers.
// TODO: escape sequences in identifier names.
// TODO: classify tokens.
// TODO: CRLF in line continuations.

function testUnicodeEscapesInIdentifier() {
  assertLexed(
    "var \\u0069\\u0066 = this !== thi\\u0073;",
    "var", TokenType.IDENTIFIER_NAME,
    " ", TokenType.WHITE_SPACE,
    "\\u0069\\u0066", TokenType.IDENTIFIER_NAME,
    " ", TokenType.WHITE_SPACE,
    "=", TokenType.PUNCTUATOR,
    " ", TokenType.WHITE_SPACE,
    "this", TokenType.IDENTIFIER_NAME,
    " ", TokenType.WHITE_SPACE,
    "!==", TokenType.PUNCTUATOR,
    " ", TokenType.WHITE_SPACE,
    "thi\\u0073", TokenType.IDENTIFIER_NAME,
    ";", TokenType.PUNCTUATOR);
  assertLexed(
    "ev\\u0061l('foo');",
    "ev\\u0061l", TokenType.IDENTIFIER_NAME,
    "(", TokenType.PUNCTUATOR,
    "'foo'", TokenType.STRING_LITERAL,
    ")", TokenType.PUNCTUATOR,
    ";", TokenType.PUNCTUATOR);

  assertLexed(
    "// e-accent v full-width-a l.\n"
    + "\\u00e9v\\uff41l('foo');",

    "// e-accent v full-width-a l.", TokenType.COMMENT,
    "\n", TokenType.LINE_TERMINATOR_SEQUENCE,
    "\\u00e9v\\uff41l", TokenType.IDENTIFIER_NAME,
    "(", TokenType.PUNCTUATOR,
    "'foo'", TokenType.STRING_LITERAL,
    ")", TokenType.PUNCTUATOR,
    ";", TokenType.PUNCTUATOR);
}

function assertFailsToLex(source, position) {
  var k = 0;
  var scanner = makeScanner(source);
  var tokens = [];
  try {
    for (var tok; (tok = scanner());) {
      k += tok.length;
      tokens.push(tok, classifyToken(tok));
    }
  } catch (ex) {
    assertEquals(position, k);
    return;
  }
  fail(JSON.stringify(source) + " lexed to " + JSON.stringify(tokens));
}

function testNewlinesInStringsAndRegexps() {
  assertFailsToLex("'\n'", 0);
  assertFailsToLex("'\r'", 0);
  assertFailsToLex("'\r\n'", 0);
  assertFailsToLex("'\u2028'", 0);
  assertFailsToLex("'\u2029'", 0);
  assertFailsToLex("x = \"\n\" ", 4);
  assertFailsToLex("x = \"\r\" ", 4);
  assertFailsToLex("x = \"\r\n\" ", 4);
  assertFailsToLex("x = \"\u2028\" ", 4);
  assertFailsToLex("x = \"\u2029\" ", 4);
  assertFailsToLex("var re = /\n/", 9);
  assertFailsToLex("var re = /\r\n/", 9);
  assertFailsToLex("var re = /\r/", 9);
  assertFailsToLex("var re = /\u2028/", 9);
  assertFailsToLex("var re = /\u2029/", 9);
  assertFailsToLex("var re = /[\n]/", 9);
  assertFailsToLex("var re = /[\r\n]/", 9);
  assertFailsToLex("var re = /[\r]/", 9);
  assertFailsToLex("var re = /[\u2028]/", 9);
  assertFailsToLex("var re = /[\u2029]/", 9);
}

function testUnfinishedTokens() {
  assertFailsToLex("'", 0);
  assertFailsToLex("'foo", 0);
  assertFailsToLex("'\\'", 0);
  assertFailsToLex("\"", 0);
  assertFailsToLex("\"foo", 0);
  assertFailsToLex("\"\\\"", 0);
  assertFailsToLex("\"\\\"", 0);
  assertFailsToLex("/", 0);
  assertFailsToLex("/foo", 0);
  assertFailsToLex("/[foo/", 0);
  assertFailsToLex("/[foo/]", 0);
  assertFailsToLex("/*/", 0);
  assertFailsToLex("/***", 0);
  assertFailsToLex("/** foo", 0);
}

function testBadIdentifiers() {
  // \\u002d is a dash, not allowed in an identifier name.
  assertFailsToLex("foo\\u002Dbar", 3);
  assertFailsToLex("foo\\u002dbar", 3);

  // \\u0041 is allowed, but four digits are required.
  assertFailsToLex("foo\\u0041bar = foo\\u041zaz", 18);
  //                ok ^           bad ^
  assertFailsToLex("foo\\u0041bar = foo\\u041", 18);
  assertFailsToLex("foo\\u0041bar = foo\\u", 18);

  // digits are allowed in an identifier but not at the start.
  assertFailsToLex("foo1 = foo\\u0031 != \\u0031foo", 20);
  //                       ok ^      bad ^

  for (var cc = 0; cc <= 0x7f; ++cc) {
    var ch = String.fromCharCode(cc);
    var hex = cc.toString(16);
    var escapedIdent = "\\u0000".substring(0, 6 - hex.length) + hex;
    if (/[A-Za-z_$]/.test(ch)) {
      assertLexed(escapedIdent, escapedIdent, TokenType.IDENTIFIER_NAME);
    } else {
      assertFailsToLex(escapedIdent, 0);
    }
  }
}

/* KNOWN FAILURE
function testIdentifiersAdjacentToNumbers() {
  // Not a valid program even with a space in between.
  assertFailsToLex("1x");
}
*/

function testLanguageDelimiters() {
  assertLexed(
    "var w = /<script>/;", "var", " ", "w", " ", "=", " ",
    "/<script>/", TokenType.REGEXP_LITERAL, ";");
  assertLexed(
    "var x = a </script>/;",
    "var", " ", "x", " ", "=", " ", "a", " ",
    "<", TokenType.PUNCTUATOR, "/script>/", TokenType.REGEXP_LITERAL, ";");
  assertLexed(
    "[[0]]>1",
    "[", TokenType.PUNCTUATOR, "[", "0", "]", TokenType.PUNCTUATOR, "]",
    ">", TokenType.PUNCTUATOR, "1");
  assertLexed(
    "/[\\]]>/", "/[\\]]>/", TokenType.REGEXP_LITERAL);
  assertLexed(
    "var p = a <!-- b && c --> (d);",
    "var", " ", "p", " ", "=", " ", "a", " ",
    "<", TokenType.PUNCTUATOR, "!", TokenType.PUNCTUATOR,
    "--", TokenType.PUNCTUATOR,
    " ", "b", " ", "&&", TokenType.PUNCTUATOR, " ", "c", " ",
    "--", TokenType.PUNCTUATOR, ">", TokenType.PUNCTUATOR,
    " ", "(", "d", ")", ";");
}

function testNumbers() {
  assertLexed(
    "[1,00,0x2A,0.12345678901234567890123456789e30,1E5,.5,.5e-2,0X2a]",
    "[", TokenType.PUNCTUATOR,
    "1", TokenType.NUMERIC_LITERAL,
    ",", TokenType.PUNCTUATOR,
    "00", TokenType.NUMERIC_LITERAL,
    ",", TokenType.PUNCTUATOR,
    "0x2A", TokenType.NUMERIC_LITERAL,
    ",", TokenType.PUNCTUATOR,
    "0.12345678901234567890123456789e30", TokenType.NUMERIC_LITERAL,
    ",", TokenType.PUNCTUATOR,
    "1E5", TokenType.NUMERIC_LITERAL,
    ",", TokenType.PUNCTUATOR,
    ".5", TokenType.NUMERIC_LITERAL,
    ",", TokenType.PUNCTUATOR,
    ".5e-2", TokenType.NUMERIC_LITERAL,
    ",", TokenType.PUNCTUATOR,
    "0X2a", TokenType.NUMERIC_LITERAL,
    "]", TokenType.PUNCTUATOR);
}

function testTokenTypesDisjoint() {
  assertFalse(TokenType.COMMENT === TokenType.WHITE_SPACE);
  assertFalse(TokenType.LINE_TERMINATOR_SEQUENCE === TokenType.WHITE_SPACE);
  assertFalse(TokenType.LINE_TERMINATOR_SEQUENCE === TokenType.STRING_LITERAL);
  assertFalse(TokenType.NUMERIC_LITERAL === TokenType.STRING_LITERAL);
  assertFalse(TokenType.NUMERIC_LITERAL === TokenType.REGEXP_LITERAL);
  assertFalse(TokenType.PUNCTUATOR === TokenType.REGEXP_LITERAL);
  assertFalse(TokenType.PUNCTUATOR === TokenType.IDENTIFIER_NAME);
}
