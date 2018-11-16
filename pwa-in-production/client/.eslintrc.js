module.exports = {
  "extends": [
    "standard",
    "plugin:vue/essential"
  ],
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    'semi': [1, 'always'],
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always'
    }],
    'no-useless-constructor': 'off',
    'no-unused-vars': 'warn',
    'no-new': 'warn',
    'eol-last': ['error', 'always'],
    "vue/script-indent": ["error", 2, { "baseIndent": 1 }]
  },
  "overrides": [
    {
      "files": ["*.vue"],
      "rules": {
        "indent": "off"
      }
    }
  ],
  "globals": {
    "workbox": true
  }
};
