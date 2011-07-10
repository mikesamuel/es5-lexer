// Some ecmascript 5 definitions.
/**
 * @param {Object} obj
 * @param {string} propertyName
 * @param {Object} def
 */
Object.defineProperty = function (obj, propertyName, def) {};
/**
 * @param {Object} opt_prototype
 * @return {Object}
 */
Object.create = function (opt_prototype) {};
// Browser environment.
/** @constructor */
var Window;
/** @constructor */
var Document;
/** @constructor */
var Event;
/** @constructor */
var XMLHttpRequest;
XMLHttpRequest.prototype.onreadystatechange = function (callback) {};
/** @constructor */
var Element;
/**
 * @type {Window}
 * @const
 */
var window;
/**
 * @const
 * @type {Object}
 */
var JSON;
/**
 * @param {*} obj
 * @param {function (string, *): *=} opt_replacer
 * @return {!string}
 */
JSON.stringify = function (obj, opt_replacer) {};
/**
 * @param {!string} json
 * @param {function (string, *): *=} opt_reviver
 * @return {*}
 */
JSON.parse  = function (json, opt_reviver) {};
