// Loads the source files required to run the tests.

(function () {
  var t0 = new Date;
  // If the location contains ?compiled, then use the minified bundle.
  // Run make in the directory containing Makefile if the file below is not
  // found.
  if (/[?&]compiled/.test(location.search)) {
    document.title += ' compiled';
    document.write(
        '<script src="../build/es5_lexer_compiled.js"></script>');
  } else {
    global = window;  // Needed by exports.js
    // The below happens after this script is loaded but before anything else
    // is parsed such as following script blocks which load/run tests that
    // depend on these source files.
    document.write(
        '<script src="../src/tokens.js"></script>',
        '<script src="../src/guess_is_regexp.js"></script>',
        '<script src="../src/scanner.js"></script>',
        '<script src="../src/disambiguate.js"></script>',
        '<script src="../src/exports.js"></script>');
  }
  // Time how long it takes to load the sources.
  document.write(
    "<script>(function () { var t1 = new Date, t0 = " + +t0 + ";\n"
      + "document.write("
      + "'<span class=\"bmark\">(load took ' + (t1 - t0) + 'ms)</span>');"
      + "}())</script>");
}());
