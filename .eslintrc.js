const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-non-null-assertion': OFF,
    '@typescript-eslint/no-empty-function': OFF,
    '@typescript-eslint/ban-ts-comment': WARN,
    '@typescript-eslint/ban-types': OFF,
    '@typescript-eslint/no-explicit-any': OFF,
    '@typescript-eslint/explicit-module-boundary-types': OFF,
    '@typescript-eslint/no-object-literal-type-assertion': OFF,
    'no-console': [ERROR],
    '@typescript-eslint/no-unused-vars': [ERROR, { argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx'],
      rules: {
        // Allow testing runtime errors to suppress TS errors
        '@typescript-eslint/ban-ts-comment': OFF,
      },
    },
  ],
};
