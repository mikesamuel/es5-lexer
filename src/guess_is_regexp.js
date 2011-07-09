/**
 * @fileoverview
 * Provides a heuristic to guess whether a forward slash ('/') that does not
 * start a comment starts a regular expression or a division operator.
 *
 * @author Mike Samuel <mikesamuel@gmail.com>
 */

/**
 * True iff a slash after the given run of non-whitespace tokens
 * starts a regular expression instead of a div operator : (/ or /=).
 * <p>
 * This fails on some valid but nonsensical JavaScript programs like
 * {@code x = ++/foo/i} which is quite different than
 * {@code x++/foo/i}, but is not known to fail on any known useful
 * programs.  It is based on the draft
 * <a href="http://www.mozilla.org/js/language/js20-2000-07/rationale/syntax.html">JavaScript 2.0
 * lexical grammar</a> and requires one token of lookbehind.
 *
 * @param {string} preceder The non-whitespace, non comment token preceding
 *    the slash.
 */
function guessNextIsRegexp(preceder) {
  // Tokens that precede a regular expression in JavaScript.
  // "!", "!=", "!==", "%", "%=", "&", "&&",
  // "&&=", "&=", "(", "*", "*=", "+", "+=", ",",
  // "-", ".", "/", "/=",
  // ":", "::", ";", "<", "<<", "<<=", "<=", "=",
  // "==", "===", ">", ">=", ">>", ">>=", ">>>",
  // ">>>=", "?", "[", "^", "^=", "^^", "^^=",
  // "{", "|", "|=", "||", "||=", "~",
  // "break", "case", "continue", "delete", "do",
  // "else", "finally", "instanceof", "return",
  // "throw", "try", "typeof"

  var precederLen = preceder.length;
  var lastChar = preceder.charAt(precederLen - 1);
  switch (lastChar) {
  case '+':  // Match + but not ++.
  case '-':  // Match - but not --.
  case '.':  // Match . but not a number with a trailing decimal.
  case '/':  // Match /, but not a regexp.
    return precederLen === 1;
  default:
    // [:-?] matches ':', ';', '<', '=', '>', '?'
    // [{-~] matches '{', '|', '}', '~'
    return /^(?:break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)$|[%&(*,:-?\[^{-~]$/.test(preceder);
  }
}
