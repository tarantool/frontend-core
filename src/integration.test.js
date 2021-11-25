const { core } = require('../compiled_module/core');

test('install', () => {
  document.body.innerHTML = '<div id="root"></div>';
  core.install();
});
