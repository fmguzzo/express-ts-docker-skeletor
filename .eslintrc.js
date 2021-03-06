/*** add first "airbnb-base", to use style guide ********************************
 * extends: ["airbnb-base", "plugin:@typescript-eslint/recommended", "prettier"],
 * *****************************************************************************/
module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-types": "off",
  },
};
