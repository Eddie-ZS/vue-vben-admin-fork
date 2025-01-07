/** @type {import('stylelint').Config} */
export default {
	extends: [
		'stylelint-config-standard', // 配置 stylelint 拓展插件
		'stylelint-config-recess-order' // 配置 stylelint css 属性书写顺序插件
	],
	ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.md', '**/*.json'],
	overrides: [
		{
			customSyntax: 'postcss-html',
			files: ['*.(html|vue)', '**/*.(html|vue)'],
			rules: {
				// 禁用未知伪类
				'selector-pseudo-class-no-unknown': [
					true,
					{
						ignorePseudoClasses: ['global', 'deep']
					}
				],
				// 禁用未知伪元素
				'selector-pseudo-element-no-unknown': [
					true,
					{
						ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted']
					}
				]
			}
		},
		{
			files: ['*.scss', '**/*.scss'],
			customSyntax: 'postcss-scss',
			extends: ['stylelint-config-recommended-scss', 'stylelint-config-recommended-vue/scss']
		}
	],
	plugins: ['stylelint-order', '@stylistic/stylelint-plugin', 'stylelint-prettier', 'stylelint-scss'],
	rules: {
		// 禁用未知 at 规则
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: [
					'extends',
					'ignores',
					'include',
					'mixin',
					'if',
					'else',
					'media',
					'for',
					'at-root',
					'tailwind',
					'apply',
					'variants',
					'responsive',
					'screen',
					'function',
					'each',
					'use',
					'forward',
					'return'
				]
			}
		],
		'font-family-no-missing-generic-family-keyword': null, // 禁止在字体族名称列表中缺少通用字体族关键字
		'function-no-unknown': null, // 禁用未知函数
		'import-notation': null, // 禁用不必要的引号
		'media-feature-range-notation': null, // 禁止在媒体查询中使用无效的区间值
		'named-grid-areas-no-invalid': null, // 禁止无效的网格区域名称
		'no-descending-specificity': null, // 不允许较低特异性的选择器出现在覆盖较高特异性的选择器
		'no-empty-source': null, // 禁止空源码
		// 定义 css 属性书写顺序
		'order/order': [
			[
				'dollar-variables',
				'custom-properties',
				'at-rules',
				'declarations',
				{
					name: 'supports',
					type: 'at-rule'
				},
				{
					name: 'media',
					type: 'at-rule'
				},
				{
					name: 'include',
					type: 'at-rule'
				},
				'rules'
			],
			{ severity: 'error' }
		],
		'prettier/prettier': true, // 代码格式化
		//要求规则前有空行。
		'rule-empty-line-before': [
			'always',
			{
				ignore: ['after-comment', 'first-nested']
			}
		],
		// 禁止未知的 at 规则
		'scss/at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: [
					'extends',
					'ignores',
					'include',
					'mixin',
					'if',
					'else',
					'media',
					'for',
					'at-root',
					'tailwind',
					'apply',
					'variants',
					'responsive',
					'screen',
					'function',
					'each',
					'use',
					'forward',
					'return'
				]
			}
		],
		'scss/operator-no-newline-after': null, // 禁止在操作符之后换行
		// 选择器类名必须符合命名规则
		'selector-class-pattern':
			'^(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:[.+])?$',
		'selector-not-notation': null // 禁止使用否定选择器否定关键字
	}
};
