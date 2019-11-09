(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["recursiveDiff"] = factory();
	else
		root["recursiveDiff"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/recursive-diff.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/recursive-diff.js":
/*!*******************************!*\
  !*** ./src/recursive-diff.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* eslint-disable no-param-reassign */\nfunction getType(x) {\n  let type = typeof x;\n  if (type === 'object') {\n    if (x instanceof Array) {\n      type = 'array';\n    } else if (x instanceof Date) {\n      type = 'date';\n    }\n  }\n  return type;\n}\n\nfunction getDiff(ob1, ob2, path, result) {\n  let val1; let val2; let newpath; let key;\n  const type1 = getType(ob1);\n  const type2 = getType(ob2);\n  // initialize some defaults\n  if (path == null || typeof path !== 'string') {\n    path = '/'; // initialize to root path\n  }\n  if (result == null || typeof result !== 'object') {\n    result = {};\n  }\n  // diff algo\n  if (ob1 == null || ob2 == null) {\n    if (ob1 !== ob2) {\n      if (type1 === 'undefined') {\n        result[path] = { operation: 'add', value: ob2 };\n      } else if (type2 === 'undefined') {\n        result[path] = { operation: 'delete' };\n      } else {\n        result[path] = { operation: 'update', value: ob2 };\n      }\n    }\n  } else if (type1 !== type2 || (type1 !== 'object' && type1 !== 'array')) {\n    if (ob1 !== ob2) {\n      if (type1 === type2 && type1 === 'date') {\n        if (ob1.getTime() !== ob2.getTime()) {\n          result[path] = { operation: 'update', value: ob2 };\n        }\n      } else {\n        result[path] = { operation: 'update', value: ob2 };\n      }\n    }\n  } else {\n    let keys = Object.keys(ob1);\n    for (let i = 0; i < keys.length; i += 1) {\n      key = keys[i];\n      newpath = path === '/' ? path + key : `${path}/${key}`;\n      val1 = ob1[key];\n      val2 = ob2[key];\n\n      if (val1 == null || val2 == null) {\n        if (val1 !== val2) {\n          if (typeof val1 === 'undefined') {\n            result[newpath] = { operation: 'add', value: val2 };\n          } else if (typeof val2 === 'undefined') {\n            result[newpath] = { operation: 'delete' };\n          } else {\n            result[newpath] = { operation: 'update', value: val2 };\n          }\n        }\n      } else if (getType(val1) !== getType(val2)) {\n        result[newpath] = { operation: 'update', value: val2 };\n      } else if (typeof val1 === 'object') {\n        getDiff(val1, val2, newpath, result);\n      } else if (val1 !== val2) {\n        result[newpath] = { operation: 'update', value: val2 };\n      }\n    }\n    keys = Object.keys(ob2);\n    for (let i = 0; i < keys.length; i += 1) {\n      key = keys[i];\n      newpath = path === '/' ? path + key : `${path}/${key}`;\n      val1 = ob1[key];\n      val2 = ob2[key];\n      if (val1 !== val2) {\n        if (typeof val1 === 'undefined') {\n          result[newpath] = { operation: 'add', value: val2 };\n        }\n      }\n    }\n  }\n  return result;\n}\n\n\nfunction setValueByPath(ob, path, value, visitorCallback) {\n  if (!path.match(/^\\//)) {\n    throw new Error(`Diff path: \"${path}\" is not valid`);\n  }\n  const keys = path.split('/');\n  keys.shift();\n  let val = ob;\n  const { length } = keys;\n  for (let i = 0; i < length; i += 1) {\n    if (!val) throw new Error(`Invalid path: \"${path}\" for object: ${JSON.stringify(ob, null, 2)}`);\n    else if (keys[i].length < 1) throw new Error(`Invalid path: \"${path}\" for object: ${JSON.stringify(ob, null, 2)}`);\n\n    if (i !== length - 1) {\n      val = val[keys[i]];\n      if (visitorCallback) {\n        visitorCallback(val);\n      }\n    } else {\n      val[keys[i]] = value;\n    }\n  }\n  return ob;\n}\n\nfunction deleteValueByPath(ob, path) {\n  const keys = path.split('/');\n  keys.shift(); // removing initial blank element ''\n  let val = ob;\n  const { length } = keys;\n  for (let i = 0; i < length; i += 1) {\n    if (i !== length - 1) {\n      if (!val[keys[i]]) {\n        throw new Error(`Invalid path: \"${path}\" for object: ${JSON.stringify(ob, null, 2)}`);\n      }\n      val = val[keys[i]];\n    } else if (getType(val) === 'object') {\n      delete val[keys[i]];\n    } else {\n      const index = parseInt(keys[i], 10);\n      while (val.length > index) {\n        val.pop();\n      }\n    }\n  }\n  return ob;\n}\n\nfunction applyDiff(ob1, diff, visitorCallback) {\n  let path; let diffOb; let\n    op;\n  if (!diff) throw new Error('No diff object is provided, Nothing to apply');\n  const keys = Object.keys(diff);\n  for (let i = 0; i < keys.length; i += 1) {\n    const key = keys[i];\n    path = key;\n    diffOb = diff[key];\n    op = diffOb.operation;\n    if (op.match(/add|update|delete/)) {\n      if (op === 'add') {\n        if (path === '/') {\n          ob1 = diffOb.value;\n          break;\n        }\n        setValueByPath(ob1, path, diffOb.value, visitorCallback);\n      } else if (op === 'update') {\n        if (path === '/') {\n          ob1 = diffOb.value;\n          break;\n        }\n        setValueByPath(ob1, path, diffOb.value, visitorCallback);\n      } else {\n        if (path === '/') {\n          ob1 = null;\n          break;\n        }\n        deleteValueByPath(ob1, path);\n      }\n    } else throw new Error(`Invalid operation: \"${op}\"`);\n  }\n  return ob1;\n}\n\nmodule.exports = {\n  getDiff,\n  applyDiff,\n};\n\n\n//# sourceURL=webpack://recursiveDiff/./src/recursive-diff.js?");

/***/ })

/******/ });
});