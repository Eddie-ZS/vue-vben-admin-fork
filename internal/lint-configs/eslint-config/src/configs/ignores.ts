import type { Linter } from 'eslint';
export async function ignores(): Promise<Linter.Config[]> {
  return [
    {
      ignores: ['node_modules', 'dist'],
    },
  ];
}
