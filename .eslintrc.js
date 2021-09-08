module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      ts: true,
    },
  },
  env: {
    browser: true,
    es6: true,
  },
  extends: [],
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-array-constructor": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
  },
};
