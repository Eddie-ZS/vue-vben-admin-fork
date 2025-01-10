import type { Linter } from 'eslint';

import { inferOpDefault } from '../util';

export async function perfectionist(): Promise<Linter.Config[]> {
	const perfectionistPlugin = await inferOpDefault(
		// @ts-expect-error - ignore type
		import('eslint-plugin-perfectionist')
	);

	return [
		perfectionistPlugin.configs['recommended-natural'],
		{
			rules: {
				'perfectionist/sort-exports': [
					'error',
					{
						order: 'asc',
						// 按自然顺序对项目进行排序（例如，“item2” < “item10”）
						type: 'natural'
					}
				],
				'perfectionist/sort-imports': [
					'error',
					{
						customGroups: {
							type: {
								'vbird-core-type': ['^@vbird-core/.+'],
								'vbird-type': ['^@vbird/.+'],
								'vue-type': ['^vue$', '^vue-.+', '^@vue/.+']
							},
							value: {
								vbird: ['^@vbird/.+'],
								'vbird-core': ['^@vbird-core/.+'],
								vue: ['^vue$', '^vue-.+', '^@vue/.+']
							}
						},
						environment: 'node',
						groups: [
							['external-type', 'builtin-type', 'type'],
							'vue-type',
							'vbird-type',
							'vbird-core-type',
							['parent-type', 'sibling-type', 'index-type'],
							['internal-type'],
							'builtin',
							'vue',
							'vbird',
							'vbird-core',
							'external',
							'internal',
							['parent', 'sibling', 'index'],
							'side-effect',
							'side-effect-style',
							'style',
							'object',
							'unknown'
						],
						internalPattern: ['^#/.+'],
						newlinesBetween: 'always',
						order: 'asc',
						type: 'natural'
					}
				],
				'perfectionist/sort-modules': 'off',
				'perfectionist/sort-named-exports': [
					'error',
					{
						order: 'asc',
						type: 'natural'
					}
				],
				'perfectionist/sort-objects': [
					'error',
					{
						customGroups: {
							items: 'items',
							list: 'list',
							children: 'children'
						},
						groups: ['unknown', 'items', 'list', 'children'],
						ignorePattern: ['children'],
						order: 'asc',
						type: 'natural'
					}
				]
			}
		}
	];
}
