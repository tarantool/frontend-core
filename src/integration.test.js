const { core } = require('../');

test('install', () => {
  if (typeof document !== 'undefined') {
    document.body.innerHTML = '<div id="root"></div>';
  }

  core.install();
});
