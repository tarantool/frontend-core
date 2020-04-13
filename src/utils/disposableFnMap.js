import nanoid from 'nanoid'

const fnMap = {}
const fnKeyMap = new Map()

// to hash table
fnMap['1'] = 1
delete fnMap['1']

export const getKeyByFn = fn => fnKeyMap.get(fn)

export const disposableFunctionKey = fn => {
  const key = getKeyByFn(fn) || nanoid()
  fnMap[key] = fn
  fnKeyMap.set(fn, key)
  return key
}

export const getFnByKey = key => fnMap[key]

export const disposeFnByKey = key => {
  const fn = fnMap[key]
  delete fnMap[key]
  fnKeyMap.delete(fn)
}
