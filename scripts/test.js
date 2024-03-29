'use strict';
const { initEnv } = require('@tarantool.io/webpack-config');

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

initEnv();

const jest = require('jest');
let argv = process.argv.slice(2);

// Watch unless on CI or in coverage mode
if (!process.env.CI && argv.indexOf('--coverage') < 0 && argv.indexOf('--once') < 0) {
  argv.push('--watch');
}

if (argv.indexOf('--once') >= 0) {
  argv.splice(argv.indexOf('--once'), 1);
}

jest.run(argv);
