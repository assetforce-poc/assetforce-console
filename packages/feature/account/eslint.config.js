import eslintConfigAssetforce from '@assetforce/eslint-config/library';

export default [
  ...eslintConfigAssetforce,
  {
    ignores: ['**/generated/', '**/*.g.ts', '**/*.g.tsx'],
  },
];
