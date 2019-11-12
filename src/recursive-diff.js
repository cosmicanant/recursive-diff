const { types, iterableTypes, errors } = require('./config');
const utils = require('./utils');

const checkType = {
  [types.NUMBER]: utils.isNumber,
  [types.BOOLEAN]: utils.isBoolean,
  [types.STRING]: utils.isString,
  [types.DATE]: utils.isDate,
  [types.UNDEFINED]: utils.isUndefined,
  [types.NULL]: utils.isNull,
  [types.ARRAY]: utils.isArray,
  [types.MAP]: utils.isMap,
  [types.SET]: utils.isSet,
  [types.ITERABLE_OBJECT]: utils.isIterableObject,
};

const checkEqualityForComplexTypes = {
  [types.DATE]: utils.areDatesEqual,
};

function getType(x) {
  const keys = Object.keys(checkType);
  let type = types.DEFAULT;
  for (let i = 0; i < keys.length; i += 1) {
    if (checkType[keys[i]](x)) {
      type = keys[i];
      break;
    }
  }
  return type;
}

function isTraversalNeeded(type1, type2) {
  return type1 === type2 && iterableTypes.indexOf(type1) >= 0;
}

function areEqual(x, y, type1, type2) {
  if (type1 !== type2) {
    return false;
  }
  return checkEqualityForComplexTypes[type1] ? checkEqualityForComplexTypes[type1](x, y) : x === y;
}

function compareValuesAndGetDiff(x, y, type1, type2, path, diff) {
  if (type1 === types.UNDEFINED && type2 !== types.UNDEFINED) {
    diff.push({
      path,
      op: 'add',
      val: y,
    });
  } else if (type1 !== types.UNDEFINED && type2 === types.UNDEFINED) {
    diff.push({
      path,
      op: 'delete',
      val: y,
    });
  } else if (!(areEqual(x, y, type1, type2))) {
    diff.push({
      path,
      op: 'update',
      val: y,
    });
  } else {
    utils.noop();
  }
}

function getKeys(x, y, type) {
  let keys;
  if (type === types.ITERABLE_OBJECT) {
    keys = new Set(Object.keys(x).concat(Object.keys(y)));
  } else if (type === types.ARRAY) {
    keys = x.length > y.length ? new Array(x.length) : new Array(y.length);
    keys = keys.fill(0, 0);
    keys = keys.map((el, i) => i);
    keys = new Set(keys);
  }
  return keys;
}

function getDiff(x, y, path, diff) {
  const type1 = getType(x);
  const type2 = getType(y);
  const currPath = path || [];
  const currDiff = diff || [];
  if (isTraversalNeeded(type1, type2)) {
    const iterator = getKeys(x, y, type1).values();
    let key;
    // eslint-disable-next-line no-cond-assign
    while ((key = iterator.next().value) != null) {
      getDiff(x[key], y[key], currPath.concat(key), currDiff);
    }
  } else {
    compareValuesAndGetDiff(x, y, type1, type2, path, currDiff);
  }
  return currDiff;
}


const opHandlers = {
  add: utils.setValueByPath,
  update: utils.setValueByPath,
  delete: utils.deleteValueByPath,
};

function applyDiff(x, diff, visitorCallback) {
  if (!(diff instanceof Array)) throw new Error(errors.INVALID_DIFF_FORMAT);
  diff.forEach((diffItem) => {
    const { op, val, path } = diffItem;
    if (!opHandlers[op]) {
      throw new Error(errors.INVALID_DIFF_OP);
    }
    // eslint-disable-next-line no-param-reassign
    x = opHandlers[op](x, path, val, visitorCallback);
  });
  return x;
}

module.exports = {
  getDiff,
  applyDiff,
};
