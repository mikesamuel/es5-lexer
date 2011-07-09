/**
 * @fileoverview
 * Defines a scanner for EcmaScript 5.
 *
 * @author Mike Samuel <mikesamuel@gmail.com>
 */

var ES5_REGEXP_LITERAL_TOKEN = new RegExp(
  "^"
  + "\\/"  // A slash starts a regexp
  + "(?:"  // which can contain any number of
    // chars escept charsets, escape-sequences, line-terminators, delimiters
    + "[^\\\\\\[/\\r\\n\\u2028\\u2029]"
    // or a charset
    + "|\\["  // that starts with a '['
      + "(?:"  // and contains at least one of
        // chars except charset ends, escape sequences, line terminators
        + "[^\\]\\\\\\r\\n\\u2028\\u2029]"
        // or an escape sequence of line continuation
        + "|\\\\(?:\\r\\n?|[^\\rux]|u[0-9A-Fa-f]{4}|x[0-9A-Fa-f]{2})"
      + ")+"
    + "\\]"  // finished by a ']'
    // or an escape sequence or line terminator
    + "|\\\\(?:\\r\\n?|[^\\rux]|u[0-9A-Fa-f]{4}|x[0-9A-Fa-f]{2})"
  + ")*"
  // finished by a '/'
  + "\\/"
  // with optional flags.
  // The lexical grammar says flags can be any IdentifierName
  // which is silly since only the letters 'g', 'i', and 'm' are allowed by
  // the RegExp spec.
  // The definition of IdentifierName is huge, so rather than include it here
  // I use a simple flag definition.
  // It is possible that this definition could cause an invalid program to
  // tokenize differently, e.g. "/foo/bar" would tokenize as two tokens:
  // a RegExp literal "/foo/", and an IdentifierName "bar".
  // Our disambiguator makes sure that our interpretation holds.
  + "[gim]*");

var ES5_DIV_OP_TOKEN = /^\/=?/;

/**
 * Defines a scanner for EcmaScript 5 as a function that given a string of
 * EcmaScript 5 source returns a function that when called returns a single
 * token or null when the source is exhausted.
 * 
 * <p>
 * This scanner uses a heuristic to resolve ambiguity in the EcmaScript 5
 * lexical grammar.
 * As such, valid EcmaScript 5 parsers may derive different token boundaries.
 * Use {@link #disambiguateTokenStream} to remove this ambiguity.
 *
 * <p>
 * The concatenation of the outputs is the input.
 * 
 * <p>
 * If the input string is a valid Program/Expression, then the concatenation
 * of the output strings is a valid Program/Expression.
 * 
 * <p>
 * Throws an Error if there is no valid next token.
 */
function makeScanner(source) {
  var src = source;
  // Last non-comment, non-whitespace token.
  var lastNonIgnorable = null;

  return function () {
    // Null indicates no more tokens.
    if (!src) {
      return (src = null);  // Release for GC.
    }
    var match = src.match(ES5_TOKEN);
    if (!match) {
      if ("/" === src[0]) {
        match = src.match(
          lastNonIgnorable === null || guessNextIsRegexp(lastNonIgnorable)
          ? ES5_REGEXP_LITERAL_TOKEN
          : ES5_DIV_OP_TOKEN);
      }
      if (!match) {
        throw new Error("No valid token at front of " + src);
      }
    }
    var token = match[0];
    if (!ES5_IGNORABLE_TOKEN_PREFIX.test(token)) {  // Not ignorable.
      lastNonIgnorable = token;
    }
    src = src.substring(token.length);
    return token;
  };
}

/**
 * True if given a LineTerminatorSequence token or MultiLineComment token
 * that is lexically equivalent to a LineTerminatorSequence because it contains
 * an embedded newline.
 * False if given a different valid EcmaScript 5 token.
 *
 * <blockquote>
 *   <h2>7.4 Comments</h2>
 *   ...
 *   If a MultiLineComment contains a line terminator character, then
 *   the entire comment is considered to be a LineTerminator for purposes
 *   of parsing by the syntactic grammar.
 * </blockquote>
 */
function isLineTerminator(token) {
  return /(?:^|\/\*.*)[\r\n\u2028\u2029]/.test(token);
}
