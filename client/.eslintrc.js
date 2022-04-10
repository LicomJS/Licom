module.exports = {
  extends: ["eslint:recommended", "plugin:react/recommended"],
  rules: {
    "no-unused-vars": "warn",
    "no-console": "warn",
    "no-empty": "off",
    "no-undef": "off",
    "no-warning-comments": [
      "warn",
      { terms: ["fixme", "xxx", "todo"], location: "anywhere" },
    ],
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },

  env: {
    es6: true,
    browser: true,
  },
};
