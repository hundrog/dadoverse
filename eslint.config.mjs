// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // Your custom configs here
  {
    "@stylistic/quotes": ["error", "double"],
     "@stylistic/semi": ["error", "never"]
  },
);
