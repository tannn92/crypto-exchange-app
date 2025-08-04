module.exports = {
  root: true,
  extends: ['@react-native-community'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  rules: {
    'react-native/no-unused-styles': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': 'off', // Disable prettier for now
    'react-native/no-inline-styles': 'off', // Allow inline styles for dynamic theming
  },
};