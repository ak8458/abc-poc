module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': ['error', 'unix'], // enforce unix linebreaks
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
  },
  overrides: [
    {
      // Node.js build script — CommonJS, no browser globals
      files: ['ue/build-json.js'],
      env: { node: true, browser: false },
      parserOptions: { sourceType: 'script' },
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      // JSON files — syntax validation + consistent formatting
      files: ['**/*.json'],
      plugins: ['jsonc'],
      parser: 'jsonc-eslint-parser',
      extends: ['plugin:jsonc/recommended-with-json'],
      rules: {
        'jsonc/indent': ['error', 2],
        'jsonc/array-bracket-spacing': ['error', 'never'],
        'jsonc/comma-dangle': ['error', 'never'],
        'jsonc/key-spacing': ['error', { beforeColon: false, afterColon: true }],
        'jsonc/object-curly-spacing': ['error', 'always'],
      },
    },
  ],
};
