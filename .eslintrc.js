module.exports = {
  extends: [
    '@tarantool.io/eslint-config',
    '@tarantool.io/eslint-config/react',
    '@tarantool.io/eslint-config/emotion',
    '@tarantool.io/eslint-config/cypress',
  ],
  rules: {
    'sonarjs/cognitive-complexity': 'off',
  },
};
