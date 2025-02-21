// @ts-check
import withNuxt from ".nuxt/eslint.config.mjs";

import globals from "globals";
import vueParser from "vue-eslint-parser";
import vue from "eslint-plugin-vue";
import typescriptParser from "@typescript-eslint/parser";

export default withNuxt([
  {
    ignores: ["./.nuxt/*", "./.output/*", "./.data/*"],

    languageOptions: {
      // Use vue-eslint-parser to parse `.vue` files
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser, // Use TypeScript parser for the <script> block
        ecmaVersion: 2020, // You can change this to a higher version if needed
        sourceType: "module", // Support ECMAScript modules,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.node, NodeJS: true },
    },

    plugins: { vue },
  },
]).overrideRules({
  quotes: ["warn", "double", { avoidEscape: true }],
  "prefer-promise-reject-errors": "off",
  // "no-debugger": "warn",
  // "no-unreachable": "warn",
  // "no-undef": "warn",
  // "no-empty": "warn",
  // "no-unused-vars": "off", // handled by @typescript-eslint/no-unused-vars

  "vue/no-unused-vars": "off", // handled by @typescript-eslint/no-unused-vars
  "vue/multi-word-component-names": "off",
  "vue/no-v-text-v-html-on-component": "off",
  "vue/no-multiple-template-root": "off",
  "vue/html-self-closing": "off",

  "@typescript-eslint/no-unsafe-call": "warn",
  "@typescript-eslint/no-unsafe-member-access": "warn",
  "@typescript-eslint/no-unsafe-argument": "warn",
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/ban-ts-comment": "warn",
  "@typescript-eslint/no-this-alias": "off",
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      varsIgnorePattern: "^_", // Ignore variables starting with "_"
      argsIgnorePattern: "^_", // Ignore arguments starting with "_"
      caughtErrorsIgnorePattern: "^_", // Ignore caught errors starting with "_"
    },
  ],
});
