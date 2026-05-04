// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/semi': ['error', 'never']
  }
)
