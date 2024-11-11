import type { Linter } from 'eslint'

import {
  typescript
} from './configs'


type FlatConfig = Linter.Config

type FlatConfigPromise =
  | FlatConfig
  | Promise<FlatConfig>
  | FlatConfig[]
  | Promise<FlatConfig[]>;


  console.log('ts', typescript());

  /**
   *
   * @param config eslint 自定义配置
   * @returns
   */
async function defineConfig(config: FlatConfig[] = []) {
  const configs: FlatConfigPromise[] = [
    ...config,
  ]


  const resolvedConfig = await Promise.all(configs)
  return resolvedConfig.flat()
}

export { defineConfig }
