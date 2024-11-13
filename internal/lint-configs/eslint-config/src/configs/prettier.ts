import type { Linter } from 'eslint';
import { inferOpDefault } from '../util';
export async function prettier(): Promise<Linter.Config[]> {
  const [eslintPluginPrettierRecommended] = await Promise.all([
    inferOpDefault(import('eslint-plugin-prettier/recommended')),
  ] as const);
  return [eslintPluginPrettierRecommended];
}
