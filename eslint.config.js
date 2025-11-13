// eslint.config.js
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
// Global ignores
{
ignores: ['dist', 'node_modules'],
},

// Base configuration for all TypeScript files
...tseslint.configs.recommended,

// Configuration for your specific source files
{
files: ['src/**/*.ts'],
rules: {
// You can override or add rules here. For example:
// "@typescript-eslint/explicit-function-return-type": "off",
},
},

// IMPORTANT: This must be the last configuration in the array.
// It disables any ESLint rules that might conflict with Prettier.
prettierConfig
);