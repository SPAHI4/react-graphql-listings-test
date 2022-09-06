module.exports = {
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'prettier',
  ],
  parserOptions: { project: ['./tsconfig.json'] },
  env: {
    node: true,
    browser: false,
    jest: true,
  },
};
