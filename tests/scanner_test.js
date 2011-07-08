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
