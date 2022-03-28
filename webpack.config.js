const { join } = require('path');

const { createWebpackConfiguration, initEnv } = require('@tarantool.io/webpack-config');
const { namespace } = require('./module-config');

const env = initEnv();
const root = __dirname;

const isModule = process.env['WEBPACK_BUNDLE_MODULE'] === 'true';
const isServe = process.env['WEBPACK_SERVE'] === 'true';
const entry = isServe ? join(root, 'src', 'index.js') : join(root, 'src', 'module.js');
const build = isModule ? join(root, 'compiled_module') : join(root, 'build');
const htmlTemplate = isServe ? join(root, 'public', 'index.html') : undefined;

const lua = isModule
  ? undefined
  : {
      entryRegExp: /core\.[a-f0-9]+\.js$/,
      namespace,
    };

const middleware = (isModule) => (cfg) => {
  if (isModule) {
    cfg.output.filename = 'core.js';
  } else {
    cfg.output.filename = `static/${namespace}/core.[contenthash:8].js`;
    cfg.output.chunkFilename = `static/${namespace}/[contenthash:8].chunk.js`;
  }

  cfg.output = {
    ...cfg.output,
    library: 'tt_module',
    libraryTarget: 'umd',
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
  };

  return cfg;
};

module.exports = createWebpackConfiguration({
  namespace,
  root,
  env,
  entry,
  build,
  htmlTemplate,
  lua,
  lint: true,
  emotion: true,
  middleware: middleware(isModule),
});
