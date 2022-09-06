module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  ignorePatterns: ["dist", "coverage"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  overrides: [
    {
      files: [".eslintrc.js", "webpack.config.js"],
      env: {
        node: true,
        browser: false
      }
    },
    {
      files: ["*.test.ts"],
      env: {
        jest: true
      }
    }
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {}
};
