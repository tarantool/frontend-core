// @flow
const alphabet = '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const nanoid = (): string => {
  let res = '';
  for (let i = 0; i < 16; i++) {
    res += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return res;
};

export default nanoid;
