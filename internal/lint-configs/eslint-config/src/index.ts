import type { Linter } from "eslint";
import type { Config as TsFlagConfig } from "typescript-eslint";

import { typescript } from "./configs";

// 定义 eslint 默认配置类型
type FlatConfig = Linter.Config;
// TsFlagConfig 为 typescript-eslint 配置类型
type FlatConfigPromise = FlatConfig[] | Promise<FlatConfig[]> | TsFlagConfig;

/**
 *
 * @param config eslint 自定义配置
 * @returns
 */
async function defineConfig(config: FlatConfig[] = []) {
  const configs: FlatConfigPromise[] = [
    // 自定义配置
    typescript(),
    config,
  ];

  const resolvedConfig = await Promise.all(configs);
  return resolvedConfig.flat(Infinity);
}

export { defineConfig };
