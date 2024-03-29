export const didPromiseResolve = (promiseToTest, timeout = 0) => {
  let didResolve = false;
  promiseToTest.then(() => {
    didResolve = true;
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(didResolve);
    }, timeout);
  });
};
