import type { Linter } from 'eslint';

import { inferOpDefault } from '../util';

export async function regexp(): Promise<Linter.Config[]> {
	const [pluginRegexp] = await Promise.all([inferOpDefault(import('eslint-plugin-regexp'))] as const);

	return [
		{
			plugins: {
				regexp: pluginRegexp
			},
			rules: {
				...pluginRegexp.configs.recommended.rules
			}
		}
	];
}
