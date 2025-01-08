import type { Linter } from 'eslint';

import { inferOpDefault } from '../util';

/**
 * ESLint 指令注释插件规则配置
 */
export async function comments(): Promise<Linter.Config[]> {
	const [pluginComments] = await Promise.all([
		// @ts-expect-error: ignore type
		inferOpDefault(import('eslint-plugin-eslint-comments'))
	] as const);

	return [
		{
			plugins: {
				'eslint-comments': pluginComments
			},
			rules: {
				// 不允许对多个 ESLINT禁用注释 进行启用注释
				'eslint-comments/no-aggregating-enable': 'error',
				// 不允许 eslint-disable 禁用注释 对同一规则重复进行禁用
				'eslint-comments/no-duplicate-disable': 'error',
				// 不允许 eslint-disable 注释 对不存在或则空白进行禁用
				'eslint-comments/no-unlimited-disable': 'error',
				// 不允许 eslint-enable 注释 对不存在、未禁用的规则或则空白进行启用
				'eslint-comments/no-unused-enable': 'error'
			}
		}
	];
}
