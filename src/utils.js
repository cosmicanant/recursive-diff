const instanceOf = (instance) => (x) => x instanceof instance;

const isNumber = (x) => typeof x === 'number';
const isBoolean = (x) => typeof x === 'boolean';
const isString = (x) => typeof x === 'string';
const isDate = instanceOf(Date);
const isUndefined = (x) => typeof x === 'undefined';
const isNull = (x) => x === null;
const isArray = instanceOf(Array);
const isMap = instanceOf(Map);
const isSet = instanceOf(Set);
const isIterableObject = (x) => {
  const type = Object.prototype.toString.call(x);
  return type === '[object Object]';
};
const noop = () => {};

const areDatesEqual = (dt1, dt2) => dt1.getTime() === dt2.getTime();

// eslint-disable-next-line default-param-last
function setValueByPath(x, path = [], value, visitorCallback) {
  if (!(isArray(path))) {
    throw new Error(`Diff path: "${path}" is not valid`);
  }
  const { length } = path;
  if (length === 0) {
    return value;
  }
  let val = x;
  for (let i = 0; i < length; i += 1) {
    const key = path[i];
    if (!val) throw new Error(`Invalid path: "${path}" for object: ${JSON.stringify(x, null, 2)}`);
    else if (key == null) throw new Error(`Invalid path: "${path}" for object: ${JSON.stringify(x, null, 2)}`);

    if (i !== length - 1) {
      val = val[key];
      if (visitorCallback) {
        visitorCallback(val);
      }
    } else {
      val[key] = value;
    }
  }
  return x;
}

function deleteValueByPath(ob, path) {
  const keys = path || [];
  if (keys.length === 0) {
    return undefined;
  }
  let val = ob;
  const { length } = keys;
  for (let i = 0; i < length; i += 1) {
    if (i !== length - 1) {
      if (!val[keys[i]]) {
        throw new Error(`Invalid path: "${path}" for object: ${JSON.stringify(ob, null, 2)}`);
      }
      val = val[keys[i]];
    } else if (isIterableObject(val)) {
      delete val[keys[i]];
    } else {
      const index = parseInt(keys[i], 10);
      while (val.length > index) {
        val.pop();
      }
    }
  }
  return ob;
}

module.exports = {
  isNumber,
  isBoolean,
  isString,
  isDate,
  isUndefined,
  isNull,
  isArray,
  isMap,
  isSet,
  isIterableObject,
  noop,
  areDatesEqual,
  setValueByPath,
  deleteValueByPath,
};
