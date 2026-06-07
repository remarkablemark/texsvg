import { fileURLToPath } from 'node:url';

import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tsdoc from 'eslint-plugin-tsdoc';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignorePath),

  {
    files: ['**/*.{cjs,cts,js,jsx,mjs,mts,ts,tsx}'],

    plugins: {
      'simple-import-sort': simpleImportSort,
      eslint,
      prettier,
      tsdoc,
    },

    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: ['tsconfig.build.json', 'tsconfig.test.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      'no-console': 'error',
      'no-debugger': 'error',
      'prettier/prettier': 'error',
    },
  },
]);
