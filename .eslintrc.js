module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: true,
    commonjs: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: [2, "always"],
    "comma-dangle": "off",
  },
  globals: {
    document: false,
  },
};
