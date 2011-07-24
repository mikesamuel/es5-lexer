/**
 * @fileoverview
 * Provides a heuristic to guess whether a forward slash ('/') that does not
 * start a comment starts a regular expression or a division operator.
 *
 * @author Mike Samuel <mikesamuel@gmail.com>
 */

var REGEXP_PRECEDER_TOKEN_RE = new RegExp(
  "^(?:"  // Match the whole tokens below
    + "break"
    + "|case"
    + "|continue"
    + "|delete"
    + "|do"
    + "|else"
    + "|finally"
    + "|in"
    + "|instanceof"
    + "|return"
    + "|throw"
    + "|try"
    + "|typeof"
    + "|void"
    // Binary operators which cannot be followed by a division operator.
    + "|[+]"  // Match + but not ++.  += is handled below.
    + "|-"    // Match - but not --.  -= is handled below.
    + "|[.]"    // Match . but not a number with a trailing decimal.
    + "|[/]"  // Match /, but not a regexp.  /= is handled below.
    + "|,"    // Second binary operand cannot start a division.
    + "|[*]"  // Ditto binary operand.
  + ")$"
  // Or match a token that ends with one of the characters below to match
  // a variety of punctuation tokens.
  // Some of the single char tokens could go above, but putting them below
  // allows closure-compiler's regex optimizer to do a better job.
  // The right column explains why the terminal character to the left can only
  // precede a regexp.
  + "|["
    + "!"  // !           prefix operator operand cannot start with a division
    + "%"  // %           second binary operand cannot start with a division
    + "&"  // &, &&       ditto binary operand
    + "("  // (           expression cannot start with a division
    + ":"  // :           property value, labelled statement, and operand of ?:
           //             cannot start with a division
    + ";"  // ;           statement & for condition cannot start with division
    + "<"  // <, <<, <<   ditto binary operand
    // !=, !==, %=, &&=, &=, *=, +=, -=, /=, <<=, <=, =, ==, ===, >=, >>=, >>>=,
    // ^=, |=, ||=
    // All are binary operands (assignment ops or comparisons) whose right
    // operand cannot start with a division operator
    + "="
    + ">"  // >, >>, >>>  ditto binary operand
    + "?"  // ?           expression in ?: cannot start with a division operator
    + "["  // [           first array value & key expression cannot start with
           //             a division
    + "^"  // ^           ditto binary operand
    + "{"  // {           statement in block and object property key cannot start
           //             with a division
    + "|"  // |, ||       ditto binary operand
    + "}"  // }           PROBLEMATIC: could be an object literal divided or
           //             a block.  More likely to be start of a statement after
           //             a block which cannot start with a /.
    + "~"  // ~           ditto binary operand
  + "]$"
  // The exclusion of ++ and -- from the above is also problematic.
  // Both are prefix and postfix operators.
  // Given that there is rarely a good reason to increment a regular expression
  // and good reason to have a post-increment operator as the left operand of
  // a division (x++ / y) this pattern treats ++ and -- as division preceders.
  );


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
  return REGEXP_PRECEDER_TOKEN_RE.test(preceder);
}
