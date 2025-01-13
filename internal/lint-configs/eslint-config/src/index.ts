import type { Linter } from 'eslint';
import type { Config as TsFlagConfig } from 'typescript-eslint';

import {
	command,
	comments,
	disabled,
	ignores,
	importX,
	javascript,
	jsdoc,
	jsonc,
	node,
	perfectionist,
	prettier,
	regexp,
	test,
	turbo,
	typescript,
	unicorn,
	vue
} from './configs';
import { customConfig } from './custom-config';

// 定义 eslint 默认配置类型
type FlatConfig = Linter.Config;
// TsFlagConfig 为 typescript-eslint 配置类型
type FlatConfigPromise = FlatConfig[] | Promise<FlatConfig[]> | TsFlagConfig;

/**
 *
 * @param config eslint 规则配置
 */
async function defineConfig(config: FlatConfig[] = []) {
	const configs: FlatConfigPromise[] = [
		ignores(),
		javascript(),
		vue(),
		typescript(),
		prettier(),
		jsonc(),
		disabled(),
		importX(),
		node(),
		perfectionist(),
		comments(),
		jsdoc(),
		unicorn(),
		test(),
		regexp(),
		command(),
		turbo(),
		config,
		customConfig
	];

	const resolvedConfig = await Promise.all(configs);
	return resolvedConfig.flat(Infinity);
}

export { defineConfig };
