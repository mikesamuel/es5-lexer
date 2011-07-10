/**
 * @fileoverview Definitions for the Webkit console specification.
 * @see http://trac.webkit.org/browser/trunk/WebCore/page/Console.idl
 * @see http://trac.webkit.org/browser/trunk/WebCore/page/Console.cpp
 */

/**
 * @const
 */
var console = {};

/**
 * @param {...*} var_args
 */
console.debug = function(var_args) {};

/**
 * @param {...*} var_args
 */
console.error = function(var_args) {};

/**
 * @param {...*} var_args
 */
console.info = function(var_args) {};

/**
 * @param {...*} var_args
 */
console.log = function(var_args) {};

/**
 * @param {...*} var_args
 */
console.warn = function(var_args) {};

/**
 * @param {*} value
 */
console.dir = function(value) {};

/**
 * @param {...*} var_args
 */
console.dirxml = function(var_args) {};

/**
 * @param {*} value
 */
console.trace = function(value) {};

/**
 * @param {*} condition
 * @param {...*} var_args
 */
console.assert = function(condition, var_args) {};

/**
 * @param {*} value
 */
console.count = function(value) {};

/**
 * @param {string=} opt_title
 */
console.profile = function(opt_title) {};

console.profileEnd = function() {};

/**
 * @param {string} name
 */
console.time = function(name) {};

/**
 * @param {string} name
 */
console.timeEnd = function(name) {};

/**
 * @param {string} name
 */
console.group = function(name) {};
console.groupEnd = function() {};
