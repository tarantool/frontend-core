// we use webpack's dynamic public path feature to set path prefix from backend
if (typeof window !== 'undefined' && window.__tarantool_admin_prefix) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__tarantool_admin_prefix + '/';
}
