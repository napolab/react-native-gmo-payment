/** @type {import("eslint").Linter.Config} */
const config = {
  parserOptions: {
    project: "./tsconfig.json",
  },
  extends: ["@naporin0624/eslint-config", "@naporin0624/eslint-config/react"],
  rules: {
    "react/jsx-no-bind": "off",
    "react/react-in-jsx-scope": "off",
  },
};

module.exports = config;
