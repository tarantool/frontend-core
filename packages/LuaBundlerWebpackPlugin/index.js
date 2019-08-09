const mime = require('mime-types');
const path = require('path');
const mainFs = require('fs');
const cp = require('child_process');
const debug = require('debug')('lua-bundler');

const walkSync = function(dir, filelist) {
  const files = mainFs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(file => {
    if (mainFs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + '/', filelist);
    } else {
      filelist.push(dir + file);
    }
  });
  return filelist;
};


class LuaBundlePlugin {
  constructor(options) {
    this.options = options || {}

  }
  apply(compiler) {
    compiler.hooks.afterEmit.tap('LuaBundlePlugin', compilation => {
      const outputPath = compiler.options.output.path;
      const buildFoler = path.relative(process.cwd(), outputPath);
      const namespace = this.options.namespace || '';
      const namespaceFolder = buildFoler + '/static/' + (namespace ? namespace + '/' : '');
      const files = walkSync(namespaceFolder);
      const filemap = {};
      const isEntry = this.options.entryRegExp || /main.+js$/;
      for (const file of files){
        const fileName = file.slice(namespaceFolder.length);
        const fileBody = mainFs.readFileSync(file, { encoding: 'utf8' });
        filemap[fileName] = {
          is_entry: isEntry.test(fileName),
          body: fileBody,
          mime: mime.lookup(fileName)
        }
      }
      mainFs.writeFileSync(buildFoler + '/bundle.json', JSON.stringify(filemap), { encoding: 'utf8' })
      debug('compile bundle.json')
      cp.execSync('tarantool -l pack-front - build/bundle.json build/bundle.lua')
      debug('build bundle.lua')
    });
  }
}

module.exports = LuaBundlePlugin;
