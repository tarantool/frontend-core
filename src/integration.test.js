const { core } = require('../');

test('install', () => {
  document.body.innerHTML = '<div id="root"></div>';
  core.install();
});
