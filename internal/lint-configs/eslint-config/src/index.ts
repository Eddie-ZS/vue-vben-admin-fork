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
 * https://typescript-eslint.io/users/configs/
 * https://eslint.nodejs.cn/docs/latest/use/configure/configuration-files#typescript-%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6
 * https://turbo.build/repo/docs/reference/configuration#dependson
 */

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
