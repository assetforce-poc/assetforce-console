import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import eslintConfigAssetforce from '@assetforce/eslint-config/library';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const project = resolve(__dirname, 'tsconfig.json');

export default [
  ...eslintConfigAssetforce,
  {
    rules: {
      // Single-line if statements when possible, braces when multi-line
      curly: ['error', 'multi-line'],
    },
  },
  {
    ignores: ['**/node_modules/', '**/dist/', '**/.turbo/', '**/generated/'],
  },
];
