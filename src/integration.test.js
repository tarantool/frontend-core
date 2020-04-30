require('../compiled_module/core')

test('install', () => {
  document.body.innerHTML = '<div id="root"></div>'
  window.tarantool_enterprise_core.install()
})
