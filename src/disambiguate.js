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
function disambiguateTokenStream(tokensStream) {
  // When we turn one token into multiple tokens, we use this array
  // to store all except the first.
  var pending = [];
  
  return function () {
    var token, lastSlash;
    if (pending.length) {
      return pending.shift();
    } else {
      if ((token = tokenStream())) {
        if ("/" === token[0]) {
          if (token.length > 2) {  // A regex literal
            // a regular expression /foo/i is transformed to
            //    /./.constructor(/foo/i)

            // If the "/" at the start of /foo/i were a division operator, then
            // the transformed code would fail to parse because of the dot in
            // /./.

            // This is valid because the dot operator and the function call
            // operator bind very tightly.

            // It is semantics preserving because /./.constructor is a reliably
            // path (in SES) to RegExp and RegExp(/./) returns its input
            // unchanged.

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
                "\"" + token.substring(1, lastSlash)
                    // Escape all quotes and backslashes that are not part of
                    // line continuations.
                    .replace(/[\"\r\n\u2028\u2029]|\\(?![\r\n\u2028\u2029])/g,
                             escOneDoubleQuoteSpecial) + "\"",
                ",",
                // Flags as a string.
                "\"" + token.substring(lastSlash + 1) + "\"",
                ")");
            } else {
              pending.push(token, ")");
            }
            return "/./";
          } else {  // A division operator.
            // A use of the division operator (a / b) is transformed to
            // (a * 1 / b)

            // If our lexing was wrong and the slash was the start of a regular
            // expression, then replacing the slash with an asterisk makes the
            // content obviously a numeric operation, so our interpretation is
            // maintained.

            // This is semantics preserving because both * and / coerce both
            // sides to numbers, and have the same precedence, and 1 is
            // multiplicative identity.

            // A use of the /= operator (a /= b) is transformed to (a *= 1 / b)

            // Same argument as 2.

            // This is semantics preserving because the left-hand side is
            // unchanged and is evaluated only once, and same argument as 2.
            pending.push("1", "/");
            return token === "/" ? "*" : "*=";
          }
        } else {
          return token;
        }
      } else {  // tokenStream is finished.
        // Release for GC.
        return (tokenStream = null);
      }
    }
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
