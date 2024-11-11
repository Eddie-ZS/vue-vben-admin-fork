import type { Linter } from 'eslint'
import { inferOpDefault } from '../util'

export async function typescript(): Promise<Linter.Config[]> {

  const [tsEslint] = await Promise.all([
    inferOpDefault(import('typescript-eslint'))
  ] as const)

  return [
    {
      files: ['**/*.?([cm])[jt]s?(x)'],
      rules: {

      }
    }
  ]
}
