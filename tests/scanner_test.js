function testIsLineTerminator() {
  assertTrue(es5Lexer.isLineTerminator("\n"));
  assertTrue(es5Lexer.isLineTerminator("\r\n"));
  assertTrue(es5Lexer.isLineTerminator("\r"));
  assertTrue(es5Lexer.isLineTerminator("\u2028"));
  assertTrue(es5Lexer.isLineTerminator("\u2029"));
  assertTrue(es5Lexer.isLineTerminator("/*\n*/"));
  assertTrue(es5Lexer.isLineTerminator("/*foo\n*/"));
  assertTrue(es5Lexer.isLineTerminator("/*foo\nbar\nbaz*/"));
  assertFalse(es5Lexer.isLineTerminator(" "));
  assertFalse(es5Lexer.isLineTerminator("\x85"));
  assertFalse(es5Lexer.isLineTerminator("\t"));
  assertFalse(es5Lexer.isLineTerminator("/*foo*/"));
  assertFalse(es5Lexer.isLineTerminator("'\\\n'"));
  assertFalse(es5Lexer.isLineTerminator("'foo\\\nbar'"));
  assertFalse(es5Lexer.isLineTerminator("/\\\n/"));
  assertFalse(es5Lexer.isLineTerminator("/\\\n/"));
  assertFalse(es5Lexer.isLineTerminator("\\\n"));
  assertFalse(es5Lexer.isLineTerminator(""));
  assertFalse(es5Lexer.isLineTerminator("42"));
}

function assertLexed(input, var_args_tokens) {
  var goldenTokens = [].slice.call(arguments, 1);
  var actualTokens = [];
  var scanner = es5Lexer.makeScanner(input);
  var k = 0;
  for (var token; (token = scanner());) {
    actualTokens[k++] = token;
    // Include the types of the tokens if the golden includes it.
    if ("number" === typeof goldenTokens[k]) {
      actualTokens[k++] = es5Lexer.classifyToken(token);
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
  assertEquals(tokenType, es5Lexer.classifyToken(token));
}

function assertEmpty(lexer) {
  assertEquals(null, lexer());
}

function skipSpaces(lexer) {
  return function () {
    for (var token; (token = lexer());) {
      if (es5Lexer.classifyToken(token) !== es5Lexer.TokenType.WHITE_SPACE) {
        return token;
      }
    }
    return null;
  };
}

function testRegexLiterals() {
  var lexer = skipSpaces(es5Lexer.makeScanner("foo.replace(/[A-Z]/g, '#')"));
  assertNext(lexer, "foo", es5Lexer.TokenType.IDENTIFIER_NAME);
  assertNext(lexer, ".", es5Lexer.TokenType.PUNCTUATOR);
  assertNext(lexer, "replace", es5Lexer.TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "(", es5Lexer.TokenType.PUNCTUATOR);
  assertNext(lexer, "/[A-Z]/g", es5Lexer.TokenType.REGEXP_LITERAL);
  assertNext(lexer, ",", es5Lexer.TokenType.PUNCTUATOR);
  assertNext(lexer, "'#'", es5Lexer.TokenType.STRING_LITERAL);
  assertNext(lexer, ")", es5Lexer.TokenType.PUNCTUATOR);
  assertEmpty(lexer);
}

function testSimpleExpression() {
  var lexer = skipSpaces(es5Lexer.makeScanner("while (foo) { 1; }"));
  assertNext(lexer, "while", es5Lexer.TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "(", es5Lexer.TokenType.PUNCTUATOR);
  assertNext(lexer, "foo", es5Lexer.TokenType.IDENTIFIER_NAME);
  assertNext(lexer, ")", es5Lexer.TokenType.PUNCTUATOR);
  assertNext(lexer, "{", es5Lexer.TokenType.PUNCTUATOR);
  assertNext(lexer, "1", es5Lexer.TokenType.NUMERIC_LITERAL);
  assertNext(lexer, ";", es5Lexer.TokenType.PUNCTUATOR);
  assertNext(lexer, "}", es5Lexer.TokenType.PUNCTUATOR);
  assertEmpty(lexer);
}

function testNumberDotWord() {
  // evaluates to "0"
  var lexer = skipSpaces(es5Lexer.makeScanner("0..toString()"));
  assertNext(lexer, "0.", es5Lexer.TokenType.NUMERIC_LITERAL);
  assertNext(lexer, ".", es5Lexer.TokenType.PUNCTUATOR);
  assertNext(lexer, "toString", es5Lexer.TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "(", es5Lexer.TokenType.PUNCTUATOR);
  assertNext(lexer, ")", es5Lexer.TokenType.PUNCTUATOR);
  assertEmpty(lexer);
}

function testByteOrderMarkersAtBeginning() {
  var lexer = skipSpaces(es5Lexer.makeScanner("\uFEFFvar foo"));
  assertNext(lexer, "var", es5Lexer.TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "foo", es5Lexer.TokenType.IDENTIFIER_NAME);
  assertEmpty(lexer);
}

function testByteOrderMarkersBetweenTokens() {
  var lexer = skipSpaces(es5Lexer.makeScanner("1.\uFEFF3"));
  assertNext(lexer, "1.", es5Lexer.TokenType.NUMERIC_LITERAL);
  assertNext(lexer, "3", es5Lexer.TokenType.NUMERIC_LITERAL);
  assertEmpty(lexer);
}

function testByteOrderMarkersInStrings() {
  var lexer = skipSpaces(es5Lexer.makeScanner("'\uFEFF'"));
  assertNext(lexer, "'\uFEFF'", es5Lexer.TokenType.STRING_LITERAL);
  assertEmpty(lexer);
}

function testEmphaticallyDecremented() {
  var lexer = skipSpaces(es5Lexer.makeScanner("i---j"));
  assertNext(lexer, "i", es5Lexer.TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "--", es5Lexer.TokenType.PUNCTUATOR);
  assertNext(lexer, "-", es5Lexer.TokenType.PUNCTUATOR);
  assertNext(lexer, "j", es5Lexer.TokenType.IDENTIFIER_NAME);
  assertEmpty(lexer);
}

function testIsRegexpFollowingWord() {
  {
    var lexer = skipSpaces(es5Lexer.makeScanner("min / max /*/**/"));
    assertNext(lexer, "min", es5Lexer.TokenType.IDENTIFIER_NAME);
    assertNext(lexer, "/", es5Lexer.TokenType.PUNCTUATOR);
    assertNext(lexer, "max", es5Lexer.TokenType.IDENTIFIER_NAME);
    assertNext(lexer, "/*/**/", es5Lexer.TokenType.COMMENT);
    assertEmpty(lexer);
  }
  {
    var lexer = skipSpaces(es5Lexer.makeScanner("in / max /*/**/"));
    assertNext(lexer, "in", es5Lexer.TokenType.IDENTIFIER_NAME);
    assertNext(lexer, "/ max /", es5Lexer.TokenType.REGEXP_LITERAL);
    assertNext(lexer, "*", es5Lexer.TokenType.PUNCTUATOR);
    assertNext(lexer, "/**/", es5Lexer.TokenType.COMMENT);
    assertEmpty(lexer);
  }
}

function testRegexpFollowingVoid() {
  var lexer = skipSpaces(es5Lexer.makeScanner("void /./mi"));
  assertNext(lexer, "void", es5Lexer.TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "/./mi", es5Lexer.TokenType.REGEXP_LITERAL);
  assertEmpty(lexer);
}

testRegexpFollowingPreincrement.knownFailure = true;
function testRegexpFollowingPreincrement() {
  var lexer = skipSpaces(es5Lexer.makeScanner("x = ++/x/mi"));
  assertNext(lexer, "x", es5Lexer.TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "=", es5Lexer.TokenType.PUNCTUATOR);
  assertNext(lexer, "++", es5Lexer.TokenType.PUNCTUATOR);
  assertNext(lexer, "/x/mi", es5Lexer.TokenType.REGEXP_LITERAL);
  assertEmpty(lexer);
}

function testRegexpFollowingPostincrement() {
  var lexer = skipSpaces(es5Lexer.makeScanner("x++/y/m"));
  assertNext(lexer, "x", es5Lexer.TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "++", es5Lexer.TokenType.PUNCTUATOR);
  assertNext(lexer, "/", es5Lexer.TokenType.PUNCTUATOR);
  assertNext(lexer, "y", es5Lexer.TokenType.IDENTIFIER_NAME);
  assertNext(lexer, "/", es5Lexer.TokenType.PUNCTUATOR);
  assertNext(lexer, "m", es5Lexer.TokenType.IDENTIFIER_NAME);
  assertEmpty(lexer);
}

function testUnicodeEscapesInIdentifier() {
  assertLexed(
    "var \\u0069\\u0066 = this !== thi\\u0073;",
    "var", es5Lexer.TokenType.IDENTIFIER_NAME,
    " ", es5Lexer.TokenType.WHITE_SPACE,
    "\\u0069\\u0066", es5Lexer.TokenType.IDENTIFIER_NAME,
    " ", es5Lexer.TokenType.WHITE_SPACE,
    "=", es5Lexer.TokenType.PUNCTUATOR,
    " ", es5Lexer.TokenType.WHITE_SPACE,
    "this", es5Lexer.TokenType.IDENTIFIER_NAME,
    " ", es5Lexer.TokenType.WHITE_SPACE,
    "!==", es5Lexer.TokenType.PUNCTUATOR,
    " ", es5Lexer.TokenType.WHITE_SPACE,
    "thi\\u0073", es5Lexer.TokenType.IDENTIFIER_NAME,
    ";", es5Lexer.TokenType.PUNCTUATOR);
  assertLexed(
    "ev\\u0061l('foo');",
    "ev\\u0061l", es5Lexer.TokenType.IDENTIFIER_NAME,
    "(", es5Lexer.TokenType.PUNCTUATOR,
    "'foo'", es5Lexer.TokenType.STRING_LITERAL,
    ")", es5Lexer.TokenType.PUNCTUATOR,
    ";", es5Lexer.TokenType.PUNCTUATOR);

  assertLexed(
    "// e-accent v full-width-a l.\n"
    + "\\u00e9v\\uff41l('foo');",

    "// e-accent v full-width-a l.", es5Lexer.TokenType.COMMENT,
    "\n", es5Lexer.TokenType.LINE_TERMINATOR_SEQUENCE,
    "\\u00e9v\\uff41l", es5Lexer.TokenType.IDENTIFIER_NAME,
    "(", es5Lexer.TokenType.PUNCTUATOR,
    "'foo'", es5Lexer.TokenType.STRING_LITERAL,
    ")", es5Lexer.TokenType.PUNCTUATOR,
    ";", es5Lexer.TokenType.PUNCTUATOR);
}

function assertFailsToLex(source, position) {
  var k = 0;
  var scanner = es5Lexer.makeScanner(source);
  var tokens = [];
  try {
    for (var tok; (tok = scanner());) {
      k += tok.length;
      tokens.push(tok, es5Lexer.classifyToken(tok));
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
      assertLexed(
        escapedIdent, escapedIdent, es5Lexer.TokenType.IDENTIFIER_NAME);
    } else {
      assertFailsToLex(escapedIdent, 0);
    }
  }
}

testIdentifiersAdjacentToNumbers.knownFailure = true;
function testIdentifiersAdjacentToNumbers() {
  // Not a valid program even with a space in between.
  assertFailsToLex("1x");
}


function testLanguageDelimiters() {
  assertLexed(
    "var w = /<script>/;", "var", " ", "w", " ", "=", " ",
    "/<script>/", es5Lexer.TokenType.REGEXP_LITERAL, ";");
  assertLexed(
    "var x = a </script>/ /= 2;",

    "var", " ", "x", " ", "=", " ", "a", " ",
    "<", es5Lexer.TokenType.PUNCTUATOR,
    "/script>/", es5Lexer.TokenType.REGEXP_LITERAL,
    " ", "/=", es5Lexer.TokenType.PUNCTUATOR, " ", "2", ";");
  assertLexed(
    "[[0]]>1",

    "[", es5Lexer.TokenType.PUNCTUATOR, "[", "0",
    "]", es5Lexer.TokenType.PUNCTUATOR, "]",
    ">", es5Lexer.TokenType.PUNCTUATOR, "1");
  assertLexed(
    "/[\\]]>/", "/[\\]]>/", es5Lexer.TokenType.REGEXP_LITERAL);
  assertLexed(
    "var p = a <!-- b && c --> (d);",
    "var", " ", "p", " ", "=", " ", "a", " ",
    "<", es5Lexer.TokenType.PUNCTUATOR, "!", es5Lexer.TokenType.PUNCTUATOR,
    "--", es5Lexer.TokenType.PUNCTUATOR,
    " ", "b", " ", "&&", es5Lexer.TokenType.PUNCTUATOR, " ", "c", " ",
    "--", es5Lexer.TokenType.PUNCTUATOR, ">", es5Lexer.TokenType.PUNCTUATOR,
    " ", "(", "d", ")", ";");
}

function testNumbers() {
  assertLexed(
    "[1,00,0x2A,0.12345678901234567890123456789e30,1E5,.5,.5e-2,0X2a]",
    "[", es5Lexer.TokenType.PUNCTUATOR,
    "1", es5Lexer.TokenType.NUMERIC_LITERAL,
    ",", es5Lexer.TokenType.PUNCTUATOR,
    "00", es5Lexer.TokenType.NUMERIC_LITERAL,
    ",", es5Lexer.TokenType.PUNCTUATOR,
    "0x2A", es5Lexer.TokenType.NUMERIC_LITERAL,
    ",", es5Lexer.TokenType.PUNCTUATOR,
    "0.12345678901234567890123456789e30", es5Lexer.TokenType.NUMERIC_LITERAL,
    ",", es5Lexer.TokenType.PUNCTUATOR,
    "1E5", es5Lexer.TokenType.NUMERIC_LITERAL,
    ",", es5Lexer.TokenType.PUNCTUATOR,
    ".5", es5Lexer.TokenType.NUMERIC_LITERAL,
    ",", es5Lexer.TokenType.PUNCTUATOR,
    ".5e-2", es5Lexer.TokenType.NUMERIC_LITERAL,
    ",", es5Lexer.TokenType.PUNCTUATOR,
    "0X2a", es5Lexer.TokenType.NUMERIC_LITERAL,
    "]", es5Lexer.TokenType.PUNCTUATOR);
}

function testTokenTypesDisjoint() {
  assertFalse(es5Lexer.TokenType.COMMENT === es5Lexer.TokenType.WHITE_SPACE);
  assertFalse(
    es5Lexer.TokenType.LINE_TERMINATOR_SEQUENCE
    === es5Lexer.TokenType.WHITE_SPACE);
  assertFalse(
    es5Lexer.TokenType.LINE_TERMINATOR_SEQUENCE
    === es5Lexer.TokenType.STRING_LITERAL);
  assertFalse(
    es5Lexer.TokenType.NUMERIC_LITERAL
    === es5Lexer.TokenType.STRING_LITERAL);
  assertFalse(
    es5Lexer.TokenType.NUMERIC_LITERAL
    === es5Lexer.TokenType.REGEXP_LITERAL);
  assertFalse(
    es5Lexer.TokenType.PUNCTUATOR
    === es5Lexer.TokenType.REGEXP_LITERAL);
  assertFalse(
    es5Lexer.TokenType.PUNCTUATOR
    === es5Lexer.TokenType.IDENTIFIER_NAME);
}

testUnnormalizeIdentifiers.knownFailure = true;
function testUnnormalizeIdentifiers() {
  // According to chapter 6 of ES5, "The [source] text is expected to
  // have been normalized to Unicode Normalized Form C (canonical
  // composition)."

  // Normalized.
  assertLexed("\u00C7", "\u00C7", es5Lexer.TokenType.IDENTIFIER_NAME);
  // Escaped & normalized.
  assertLexed("\\u00C7", "\\u00C7", es5Lexer.TokenType.IDENTIFIER_NAME);
  // Not normalized.
  // TODO: Should we normalize the source input on read?
  assertLexed("C\u0327", "\u00C7", es5Lexer.TokenType.IDENTIFIER_NAME);
  // Escaped but not normalized.
  assertLexed("C\\u0327", "\u00C7", es5Lexer.TokenType.IDENTIFIER_NAME);
}

testInvalidRegexpFlags.knownFailure = true;
function testInvalidRegexpFlags() {
  // RegularExpressionFlags is defined as IdentifierPart* which allows for
  // RegExp literals like /foo/1234 and /bar/while.
  // But IdentifierPart is a huge complex production so instead we defined
  // RegularExpressionFlags based on the actual characters allowed
  // ('i', 'g', 'm')
  // This scanner could do a better 
  assertLexed("/foo/instanceof RegExp", "/foo/instanceof", " ", "RegExp");
  // Not actually a valid program but almost.
  assertLexed(
    "do x = /foo/while \n (true)",
    "do", " ", "x", " ", "=", " ", "/foo/while", " ", "\n",
    " ", "(", "true", ")");
  // These tests fail, but the disambiguator makes sure that a regular
  // expression never runs into a keyword or number.
}

function testNonLatinSpacesAndIdentifierParts() {
  // U+200A is a space character,
  // U+200C is a joiner,
  // U+20E1 is a combining mark, and
  // U+2028 is a line terminator character.
  assertLexed(
    "foo" + "\u200C" + "bar" + "\u200A" + "baz" + "\u20E1" + "boo" + "\u2028",

    "foo\u200Cbar", es5Lexer.TokenType.IDENTIFIER_NAME,
    "\u200A", es5Lexer.TokenType.WHITE_SPACE,
    "baz\u20E1boo", es5Lexer.TokenType.IDENTIFIER_NAME,
    "\u2028", es5Lexer.TokenType.LINE_TERMINATOR_SEQUENCE);

  // The connectors in identifiers can be escaped.
  assertLexed(
    "foo" + "\\u200C" + "bar" + "\u200A" + "baz" + "\\u20E1" + "boo" + "\u2028",

    "foo\\u200Cbar", es5Lexer.TokenType.IDENTIFIER_NAME,
    "\u200A", es5Lexer.TokenType.WHITE_SPACE,
    "baz\\u20E1boo", es5Lexer.TokenType.IDENTIFIER_NAME,
    "\u2028", es5Lexer.TokenType.LINE_TERMINATOR_SEQUENCE);

  // But spaces and line terminators cannot be.
  assertFailsToLex(
    "foo" + "\\u200C" + "bar" + "\\u200A"
    + "baz" + "\\u20E1" + "boo" + "\u2028",
    12);
  assertFailsToLex(
    "foo" + "\\u200C" + "bar" + "\u200A"
    + "baz" + "\\u20E1" + "boo" + "\\u2028",
    25);
  
  // Combining marks cannot appear at the front of an identifier name
  // regardless.
  assertFailsToLex("\\u200C" + "bar", 0);
  assertFailsToLex("\\u20E1" + "boo", 0);

  // The 'u' is not case-insensitive.
  assertFailsToLex(
    "foo" + "\\U200C" + "bar" + "\Y200A" + "baz" + "\\U20E1" + "boo" + "\U2028",
    3);
}
