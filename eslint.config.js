import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // This codebase doesn't target the React Compiler. The standard
      // fetch-on-mount/param-change pattern (setState in a useEffect body)
      // is used deliberately throughout shared/api hooks and is not a bug.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    // Provider + context co-location and router config files intentionally
    // export non-component values alongside components; fast-refresh
    // isolation isn't a concern for this handful of cross-cutting files.
    files: ['src/app/providers/*.tsx', 'src/app/router.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
