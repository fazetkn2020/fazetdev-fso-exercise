import js from '@eslint/js';
import globals from 'globals';

export default [
  // 1. Global ignore patterns (like the old .eslintignore)
  {
    ignores: [
      '**/node_modules/',   // Ignore all node_modules folders
      'build/',            // Ignore your frontend build folder
    ],
  },

  // 2. Apply recommended rules to all JavaScript files
  {
    files: ['**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.node,   // Adds Node.js global variables (process, __dirname, etc.)
      },
      ecmaVersion: 'latest',
      sourceType: 'module', // Since you use 'import/export'
    },
  },
];
