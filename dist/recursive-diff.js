/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["recursiveDiff"] = factory();
	else
		root["recursiveDiff"] = factory();
})((typeof self !== 'undefined' ? self : this), () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/***/ ((module) => {

eval("const types = {\n  NUMBER: 'NUMBER',\n  BOOLEAN: 'BOOLEAN',\n  STRING: 'STRING',\n  NULL: 'NULL',\n  UNDEFINED: 'UNDEFINED',\n  DATE: 'DATE',\n  ARRAY: 'ARRAY',\n  MAP: 'MAP',\n  SET: 'SET',\n  ITERABLE_OBJECT: 'ITERABLE_OBJECT',\n  DEFAULT: 'OBJECT',\n};\n\nmodule.exports = {\n  types,\n  iterableTypes: [types.ITERABLE_OBJECT, types.MAP, types.ARRAY, types.SET],\n  errors: {\n    EMPTY_DIFF: 'No diff object is provided, Nothing to apply',\n    INVALID_DIFF_FORMAT: 'Invalid diff format',\n    INVALID_DIFF_OP: 'Unsupported operation provided into diff object',\n  },\n};\n\n\n//# sourceURL=webpack://recursiveDiff/./src/config.js?");

/***/ }),

/***/ "./src/recursive-diff.js":
/*!*******************************!*\
  !*** ./src/recursive-diff.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { types, iterableTypes, errors } = __webpack_require__(/*! ./config */ \"./src/config.js\");\nconst utils = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n\nconst checkType = {\n  [types.NUMBER]: utils.isNumber,\n  [types.BOOLEAN]: utils.isBoolean,\n  [types.STRING]: utils.isString,\n  [types.DATE]: utils.isDate,\n  [types.UNDEFINED]: utils.isUndefined,\n  [types.NULL]: utils.isNull,\n  [types.ARRAY]: utils.isArray,\n  [types.MAP]: utils.isMap,\n  [types.SET]: utils.isSet,\n  [types.ITERABLE_OBJECT]: utils.isIterableObject,\n};\n\nconst checkEqualityForComplexTypes = {\n  [types.DATE]: utils.areDatesEqual,\n};\n\nfunction getType(x) {\n  const keys = Object.keys(checkType);\n  let type = types.DEFAULT;\n  for (let i = 0; i < keys.length; i += 1) {\n    if (checkType[keys[i]](x)) {\n      type = keys[i];\n      break;\n    }\n  }\n  return type;\n}\n\nfunction isTraversalNeeded(type1, type2) {\n  return type1 === type2 && iterableTypes.indexOf(type1) >= 0;\n}\n\nfunction areEqual(x, y, type1, type2) {\n  if (type1 !== type2) {\n    return false;\n  }\n  return checkEqualityForComplexTypes[type1] ? checkEqualityForComplexTypes[type1](x, y) : x === y;\n}\n\nfunction computeOp(x, y, type1, type2) {\n  let op;\n  if (type1 === types.UNDEFINED && type2 !== types.UNDEFINED) {\n    op = 'add';\n  } else if (type1 !== types.UNDEFINED && type2 === types.UNDEFINED) {\n    op = 'delete';\n  } else if (!(areEqual(x, y, type1, type2))) {\n    op = 'update';\n  } else {\n    utils.noop();\n  }\n  return op;\n}\n\nfunction getKeys(x, y, type) {\n  if (type === types.ARRAY) {\n    const keys = x.length > y.length ? new Array(x.length) : new Array(y.length);\n    keys.fill(0);\n    return new Set(keys.map((_, i) => i));\n  }\n  return new Set(Object.keys(x).concat(Object.keys(y)));\n}\n\nfunction makeDiff(x, y, op, path, keepOldVal) {\n  const diffOb = {\n    op,\n    path,\n  };\n  if (op === 'add' || op === 'update') {\n    diffOb.val = y;\n  }\n  if (keepOldVal && op !== 'add') {\n    diffOb.oldVal = x;\n  }\n  return diffOb;\n}\n\nfunction privateGetDiff(x, y, keepOldVal, path, diff) {\n  const type1 = getType(x);\n  const type2 = getType(y);\n  const currPath = path || [];\n  const currDiff = diff || [];\n  if (isTraversalNeeded(type1, type2)) {\n    const iterator = getKeys(x, y, type1).values();\n    let { value, done } = iterator.next();\n    while (!done) {\n      if (!(Object.prototype.hasOwnProperty.call(x, value))) {\n        currDiff.push(makeDiff(x[value], y[value], 'add', currPath.concat(value), keepOldVal));\n      } else if (!(Object.prototype.hasOwnProperty.call(y, value))) {\n        currDiff.push(makeDiff(x[value], y[value], 'delete', currPath.concat(value), keepOldVal));\n      } else {\n        privateGetDiff(x[value], y[value], keepOldVal, currPath.concat(value), currDiff);\n      }\n      const curr = iterator.next();\n      value = curr.value;\n      done = curr.done;\n    }\n  } else {\n    const op = computeOp(x, y, type1, type2);\n    if (op != null) {\n      currDiff.push(makeDiff(x, y, op, path, keepOldVal));\n    }\n  }\n  return currDiff;\n}\n\nconst opHandlers = {\n  add: utils.setValueByPath,\n  update: utils.setValueByPath,\n  delete: utils.deleteValueByPath,\n};\n\nfunction privateApplyDiff(x, diff, visitorCallback) {\n  if (!(diff instanceof Array)) throw new Error(errors.INVALID_DIFF_FORMAT);\n  let y = x;\n  diff.forEach((diffItem) => {\n    const { op, val, path } = diffItem;\n    if (!opHandlers[op]) {\n      throw new Error(errors.INVALID_DIFF_OP);\n    }\n    y = opHandlers[op](y, path, val, visitorCallback);\n  });\n  return y;\n}\n\nmodule.exports = {\n  getDiff(x, y, keepOldValInDiff = false) {\n    return privateGetDiff(x, y, keepOldValInDiff);\n  },\n  applyDiff(x, diff, visitorCallback) {\n    return privateApplyDiff(x, diff, visitorCallback);\n  },\n};\n\n\n//# sourceURL=webpack://recursiveDiff/./src/recursive-diff.js?");

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((module) => {

eval("const instanceOf = (instance) => (x) => x instanceof instance;\n\nconst isNumber = (x) => typeof x === 'number';\nconst isBoolean = (x) => typeof x === 'boolean';\nconst isString = (x) => typeof x === 'string';\nconst isDate = instanceOf(Date);\nconst isUndefined = (x) => typeof x === 'undefined';\nconst isNull = (x) => x === null;\nconst isArray = instanceOf(Array);\nconst isMap = instanceOf(Map);\nconst isSet = instanceOf(Set);\nconst isIterableObject = (x) => {\n  const type = Object.prototype.toString.call(x);\n  return type === '[object Object]';\n};\nconst noop = () => {};\n\nconst areDatesEqual = (dt1, dt2) => dt1.getTime() === dt2.getTime();\n\n// eslint-disable-next-line default-param-last\nfunction setValueByPath(x, path = [], value, visitorCallback) {\n  if (!(isArray(path))) {\n    throw new Error(`Diff path: \"${path}\" is not valid`);\n  }\n  const { length } = path;\n  if (length === 0) {\n    return value;\n  }\n  let val = x;\n  for (let i = 0; i < length; i += 1) {\n    const key = path[i];\n    if (!val) throw new Error(`Invalid path: \"${path}\" for object: ${JSON.stringify(x, null, 2)}`);\n    else if (key == null) throw new Error(`Invalid path: \"${path}\" for object: ${JSON.stringify(x, null, 2)}`);\n\n    if (i !== length - 1) {\n      val = val[key];\n      if (visitorCallback) {\n        visitorCallback(val);\n      }\n    } else {\n      val[key] = value;\n    }\n  }\n  return x;\n}\n\nfunction deleteValueByPath(ob, path) {\n  const keys = path || [];\n  if (keys.length === 0) {\n    return undefined;\n  }\n  let val = ob;\n  const { length } = keys;\n  for (let i = 0; i < length; i += 1) {\n    if (i !== length - 1) {\n      if (!val[keys[i]]) {\n        throw new Error(`Invalid path: \"${path}\" for object: ${JSON.stringify(ob, null, 2)}`);\n      }\n      val = val[keys[i]];\n    } else if (isIterableObject(val)) {\n      delete val[keys[i]];\n    } else {\n      const index = parseInt(keys[i], 10);\n      while (val.length > index) {\n        val.pop();\n      }\n    }\n  }\n  return ob;\n}\n\nmodule.exports = {\n  isNumber,\n  isBoolean,\n  isString,\n  isDate,\n  isUndefined,\n  isNull,\n  isArray,\n  isMap,\n  isSet,\n  isIterableObject,\n  noop,\n  areDatesEqual,\n  setValueByPath,\n  deleteValueByPath,\n};\n\n\n//# sourceURL=webpack://recursiveDiff/./src/utils.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/recursive-diff.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});