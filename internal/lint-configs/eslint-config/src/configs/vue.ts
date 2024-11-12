import { inferOpDefault } from '../util';

export async function vue() {
  const [tsEslint, vueEslint] = await Promise.all([
    inferOpDefault(import('typescript-eslint')),
    inferOpDefault(import('eslint-plugin-vue')),
  ] as const);

  return tsEslint.config({
    files: ['*.vue'],
    languageOptions: {
      parserOptions: {},
    },
    rules: {},
  });
}
