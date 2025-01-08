import type { Linter } from 'eslint';

import { inferOpDefault } from '../util';

export async function turbo(): Promise<Linter.Config[]> {
	const [pluginTurbo] = await Promise.all([
		// @ts-expect-error - no types
		inferOpDefault(import('eslint-config-turbo'))
	] as const);

	return [
		{
			plugins: {
				turbo: pluginTurbo
			}
		}
	];
}
