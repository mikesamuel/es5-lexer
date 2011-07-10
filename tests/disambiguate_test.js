function assertDisambiguated(golden, source) {
  var tokenStream = disambiguateTokenStream(makeScanner(source));
  var tokens = [];
  for (var token; (token = tokenStream());) {
    tokens.push(token);
  }
  assertEquals(golden, tokens.join(""));
}

function assertUnambiguous(source) {
  assertDisambiguated(source, source);
}

function testEmpty() {
  assertUnambiguous("");
}

function testSimpleJs() {
  assertUnambiguous("Hello, World!");
  assertUnambiguous("// Hello, World!");
  assertUnambiguous("1 + 1 * 2 - 3 % 4");
}

function testSlashAmbiguity() {
  assertDisambiguated("a = b *1/ c", "a = b / c");
}

function testNoCommentIntroduced() {
  assertDisambiguated(
    // If we did not wrap /foo/ for whatever reason, then
    // the / at the end of /foo/ might combine with the
    // asterisk to be /*1/bar...
    "a = (/./.constructor(/foo/)*1/bar)",
    // A regex literal divided by bar
    "a = (/foo//bar)");
}

function testProblematicRegex() {
  assertDisambiguated(
    "a = /./.constructor(\"foo\\\\\\\"[/]\",\"\")",
    "a = /foo\\\"[/]/");
}

// TODO: "/foo/instanceof RegExp"
// TODO: very long tokens.