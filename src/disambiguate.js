/**
 * @fileoverview
 * Defines a token stream disambiguator that given a stream of tokens,
 * produces a token stream that will be unambiguously interpreted the
 * same way by a valid EcmaScript 5 parser.
 *
 * @author Mike Samuel <mikesamuel@gmail.com>
 */


/**
 * Given a stream of tokens, produces a token stream that will be unambiguously
 * interpreted the same way by a valid EcmaScript 5 parser.
 *
 * @param tokenStream A function that when called, returns the next token or
 *     null to indicate end of input.
 */
function disambiguateTokenStream(tokenStream) {
  // TODO: Is it important to make sure that numbers/identifiers are never flush
  // against one another?  Is it important to accept improperly spaced inputs?

  // When we turn one token into multiple tokens, we use this array
  // to store all except the first.
  var pending = [];

  return function () {
    var token, lastSlash, ch0, ch1, tokenLen;
    // If any transformations queued extra tokens, exhaust them first.
    if (pending[0]) {
      return pending.shift();
    }
    // Check whether the stream is finished.
    if (!(token = tokenStream())) {
      // Release for GC.
      return (tokenStream = null);
    }
    if ((ch0 = token[0]) === "/"
        && (ch1 = token[1]) !== "/" && ch1 !== "*") {
      if ((tokenLen = token.length) > 2) {  // A regex literal
        // a regular expression /foo/i is transformed to
        //    /./.constructor(/foo/i)

        // If the "/" at the start of /foo/i were a division operator, then
        // the transformed code would fail to parse because of the dot in
        // /./.

        // This is valid because the dot operator and the function call
        // operator bind very tightly.

        // It is semantics preserving because /./.constructor is a reliably
        // path (in SES) to RegExp and RegExp(/./) returns its input unchanged.

        // It also does not conflict with semicolon insertion -- there is no
        // infix operator on the left (or ParseError would have been thrown)
        // that might attach to the previous line.
        lastSlash = token.lastIndexOf("/");
        pending.push(".", "constructor", "(");
        if (token.indexOf("/", 1) < lastSlash) {
          // Some versions of IE have a bug whereby slashes in [...] need
          // to be escaped.  Be paranoid.  If the regex body contains a
          // backslash, then turn it into
          //   /./.constructor("pattern", "flags") instead.
          pending.push(
            // Pattern as string.
            "\""
            // Escape all quotes and backslashes.
            // We do not have to worry about line continuations since they
            // are not allowed in regex literals.
            + token.substring(1, lastSlash).replace(/[\"\r\n\u2028\u2029\\]/g,
                                                    escOneDoubleQuoteSpecial)
            + "\"",
            ",",
            // Flags as a string.
            "\"" + token.substring(lastSlash + 1) + "\"",
            ")");
        } else {
          pending.push(token, ")");
        }
        return "/./";
      } else if (tokenLen == 1) {  // A division operator.
        // A use of the division operator (a / b) is transformed to
        // (a * 1 / b)

        // If our lexing was wrong and the slash was the start of a regular
        // expression, then replacing the slash with an asterisk makes the
        // content obviously a numeric operation, so our interpretation is
        // maintained.

        // This is semantics preserving because both * and / coerce both
        // sides to numbers, and have the same precedence, and 1 is
        // multiplicative identity.

        pending.push("1", "/");
        return "*";
      } else {  // A division and assignment operator.
        // We cannot replace (a /= b) with (a *= 1 / b), since (a /= b) really
        // means (a = a / b) so if b is an infix operator whose precedence is
        // between that of division and assignment then the (1 /) we introduce
        // will bind to only the left operand of b.

        // A use of the /= operator (a /= b) is transformed to
        // (a /=
        //  b)

        // If our lexing was wrong and the slash was the start of a regular
        // expression, then putting a newline after the equals sign causes
        // the regular expression to fail to parse.

        // This is semantics preserving because no semicolon can be inserted
        // after a /= operator since it requires a right operand and
        // /= is not a restricted production.

        // This is less than ideal because it means that the line numbers in
        // the original do not perfectly match up with the line numbers in the
        // result.
        pending.push("\n");
        return token;
      }
    }
    if ("'" !== ch0 && "\"" !== ch0) {
      // Some interpters treat "this" and "thi\\u0073" equivalently and others
      // do not.
      // Decode ascii letters in identifier names so that the output tokens
      // are consistently interpreted as keywords or not.
      // TODO: Should this be done earlier so that intermediate passes that
      // look for keywords can easily find them?
      return token.replace(/\\u00[0-9A-F]{2}/ig, decodeHexChar);
    }
    return token;
  };
}

/** @private */
var DOUBLE_QUOTE_SPECIAL_ESCAPED = {
  "\"": "\\\"",
  "\\": "\\\\",
  "\n": "\\n",
  "\r": "\\r",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
/** @private */
function escOneDoubleQuoteSpecial(ch) {
  return DOUBLE_QUOTE_SPECIAL_ESCAPED[ch];
}
/**
 * "\\uABCD" => 0xABCD
 * @private
 */
function decodeHexChar(ch) {
  // This is shorter and seems as fast as
  //     String.fromCharCode(parseInt(ch.substring(2), 16))
  // fromCharCode automatically applies ToUint16 which will treat any
  // 0x<hex> string as a proper number.
  return String.fromCharCode(ch.replace("\\u", "0x"));
}
