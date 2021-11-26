// @flow
import nanoid from './nanoid';

const fnMap: { [string]: Function } = {};
const fnKeyMap = new Map<Function, string>();

export const getKeyByFn = (fn: ?Function): ?string => (fn ? fnKeyMap.get(fn) : undefined);

export const disposableFunctionKey = (fn: Function): string => {
  const key = getKeyByFn(fn) || nanoid();
  fnMap[key] = fn;
  fnKeyMap.set(fn, key);
  return key;
};

export const getFnByKey = (key: string): ?Function => fnMap[key];

export const disposeFnByKey = (key: string): void => {
  const fn = fnMap[key];
  delete fnMap[key];
  fnKeyMap.delete(fn);
};
