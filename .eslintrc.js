module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier', 'plugin:jest/recommended'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'jest'],
  rules: {
    eqeqeq: 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error', { ignoreTypeValueShadow: true }],
    '@typescript-eslint/no-unused-vars': 'error',
    'import/extensions': 'off',
    'no-console': 'off',
    'prettier/prettier': 'error',
    'func-names': 'off',
    'consistent-return': 'off',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
