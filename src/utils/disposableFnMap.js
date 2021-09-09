// @flow
import nanoid from './nanoid';

const fnMap: { [string]: Function } = {};
const fnKeyMap = new Map<Function, string>();

// to hash table
fnMap['1'] = 1;
delete fnMap['1'];

export const getKeyByFn: (Function) => ?string = (fn) => fnKeyMap.get(fn);

export const disposableFunctionKey: (Function) => string = (fn) => {
  const key = getKeyByFn(fn) || nanoid();
  fnMap[key] = fn;
  fnKeyMap.set(fn, key);
  return key;
};

export const getFnByKey: (string) => Function = (key) => fnMap[key];

export const disposeFnByKey: (string) => void = (key) => {
  const fn = fnMap[key];
  delete fnMap[key];
  fnKeyMap.delete(fn);
};
