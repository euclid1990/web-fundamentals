module.exports = {
  "extends": [
    "standard"
  ],
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "semi": [1, "always"],
    "space-before-function-paren": ["error", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always"
    }],
    "no-useless-constructor": "off",
    "no-unused-vars": "warn",
    "no-new": "warn",
    "eol-last": ["error", "always"],
    "no-undef": "off",
    "no-unused-expressions": "off",
    "new-cap": "off",
    "no-return-assign": "off"
  },
  "globals": {
    "window": true,
    "navigator": true,
    "self": true,
    "addEventListener": true,
    "caches": true,
    "importScripts": true
  }
};
