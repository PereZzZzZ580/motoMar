module.exports = [
  {
    files: ['**/*.{js,ts}'],
    ignores: ['node_modules/**'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
    },
    rules: {},
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  }
];