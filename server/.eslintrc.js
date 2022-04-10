module.exports = {
  rules: {
    "no-unused-vars": "warn",
    "no-console": "warn",
    "no-empty": "off",
    "no-warning-comments": [
      "warn",
      { terms: ["fixme", "xxx", "todo"], location: "anywhere" },
    ],
  },
  parserOptions: {
    ecmaVersion: 2017,
  },

  env: {
    es6: true,
  },
};
