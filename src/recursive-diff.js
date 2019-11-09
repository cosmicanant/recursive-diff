/* eslint-disable no-param-reassign */
function getType(x) {
  let type = typeof x;
  if (type === 'object') {
    if (x instanceof Array) {
      type = 'array';
    } else if (x instanceof Date) {
      type = 'date';
    }
  }
  return type;
}

function getDiff(ob1, ob2, path, result) {
  let val1; let val2; let newpath; let key;
  const type1 = getType(ob1);
  const type2 = getType(ob2);
  // initialize some defaults
  if (path == null || typeof path !== 'string') {
    path = '/'; // initialize to root path
  }
  if (result == null || typeof result !== 'object') {
    result = {};
  }
  // diff algo
  if (ob1 == null || ob2 == null) {
    if (ob1 !== ob2) {
      if (type1 === 'undefined') {
        result[path] = { operation: 'add', value: ob2 };
      } else if (type2 === 'undefined') {
        result[path] = { operation: 'delete' };
      } else {
        result[path] = { operation: 'update', value: ob2 };
      }
    }
  } else if (type1 !== type2 || (type1 !== 'object' && type1 !== 'array')) {
    if (ob1 !== ob2) {
      if (type1 === type2 && type1 === 'date') {
        if (ob1.getTime() !== ob2.getTime()) {
          result[path] = { operation: 'update', value: ob2 };
        }
      } else {
        result[path] = { operation: 'update', value: ob2 };
      }
    }
  } else {
    let keys = Object.keys(ob1);
    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];
      newpath = path === '/' ? path + key : `${path}/${key}`;
      val1 = ob1[key];
      val2 = ob2[key];

      if (val1 == null || val2 == null) {
        if (val1 !== val2) {
          if (typeof val1 === 'undefined') {
            result[newpath] = { operation: 'add', value: val2 };
          } else if (typeof val2 === 'undefined') {
            result[newpath] = { operation: 'delete' };
          } else {
            result[newpath] = { operation: 'update', value: val2 };
          }
        }
      } else if (getType(val1) !== getType(val2)) {
        result[newpath] = { operation: 'update', value: val2 };
      } else if (typeof val1 === 'object') {
        getDiff(val1, val2, newpath, result);
      } else if (val1 !== val2) {
        result[newpath] = { operation: 'update', value: val2 };
      }
    }
    keys = Object.keys(ob2);
    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];
      newpath = path === '/' ? path + key : `${path}/${key}`;
      val1 = ob1[key];
      val2 = ob2[key];
      if (val1 !== val2) {
        if (typeof val1 === 'undefined') {
          result[newpath] = { operation: 'add', value: val2 };
        }
      }
    }
  }
  return result;
}


function setValueByPath(ob, path, value, visitorCallback) {
  if (!path.match(/^\//)) {
    throw new Error(`Diff path: "${path}" is not valid`);
  }
  const keys = path.split('/');
  keys.shift();
  let val = ob;
  const { length } = keys;
  for (let i = 0; i < length; i += 1) {
    if (!val) throw new Error(`Invalid path: "${path}" for object: ${JSON.stringify(ob, null, 2)}`);
    else if (keys[i].length < 1) throw new Error(`Invalid path: "${path}" for object: ${JSON.stringify(ob, null, 2)}`);

    if (i !== length - 1) {
      val = val[keys[i]];
      if (visitorCallback) {
        visitorCallback(val);
      }
    } else {
      val[keys[i]] = value;
    }
  }
  return ob;
}

function deleteValueByPath(ob, path) {
  const keys = path.split('/');
  keys.shift(); // removing initial blank element ''
  let val = ob;
  const { length } = keys;
  for (let i = 0; i < length; i += 1) {
    if (i !== length - 1) {
      if (!val[keys[i]]) {
        throw new Error(`Invalid path: "${path}" for object: ${JSON.stringify(ob, null, 2)}`);
      }
      val = val[keys[i]];
    } else if (getType(val) === 'object') {
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

function applyDiff(ob1, diff, visitorCallback) {
  let path; let diffOb; let
    op;
  if (!diff) throw new Error('No diff object is provided, Nothing to apply');
  const keys = Object.keys(diff);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    path = key;
    diffOb = diff[key];
    op = diffOb.operation;
    if (op.match(/add|update|delete/)) {
      if (op === 'add') {
        if (path === '/') {
          ob1 = diffOb.value;
          break;
        }
        setValueByPath(ob1, path, diffOb.value, visitorCallback);
      } else if (op === 'update') {
        if (path === '/') {
          ob1 = diffOb.value;
          break;
        }
        setValueByPath(ob1, path, diffOb.value, visitorCallback);
      } else {
        if (path === '/') {
          ob1 = null;
          break;
        }
        deleteValueByPath(ob1, path);
      }
    } else throw new Error(`Invalid operation: "${op}"`);
  }
  return ob1;
}

module.exports = {
  getDiff,
  applyDiff,
};
