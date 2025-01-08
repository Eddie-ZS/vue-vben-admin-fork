import { inferOpDefault } from '../util';

export async function typescript() {
	// typescript-eslint 已包含 @typescript-eslint/parser 和 @typescript-eslint/eslint-plugin 内容
	const [tsEslint] = await Promise.all([inferOpDefault(import('typescript-eslint'))] as const);

	return tsEslint.config({
		files: ['**/*.?([cm])[jt]s?(x)'],
		languageOptions: {
			parser: tsEslint.parser, // 指定解析器
			parserOptions: {
				// 解析器选项
				ecmaFeatures: {
					// 启用额外的语言特性
					jsx: true // 支持 JSX
				},
				ecmaVersion: 'latest', // 指定 ECMAScript 版本
				extraFileExtensions: ['.vue'], // 允许导入 .vue 文件
				jsxPragma: 'React', // 指定 JSX 元素的 pragma
				project: './tsconfig.*?.json', // 指定项目的 tsconfig.json 文件路径
				sourceType: 'module' // 指定源码的类型为模块
			}
		},
		plugins: {
			'@typescript-eslint': tsEslint.plugin // 启用 @typescript-eslint 规则
		},
		rules: {
			...tsEslint.configs.eslintRecommended.rules, // 启用 eslint 推荐的规则
			// @see https://typescript-eslint.io/rules/ban-ts-comment/
			'@typescript-eslint/ban-ts-comment': [
				'error',
				{
					'ts-check': false,
					'ts-expect-error': 'allow-with-description',
					'ts-ignore': 'allow-with-description',
					'ts-nocheck': 'allow-with-description'
				}
			],
			'@typescript-eslint/consistent-type-definitions': 'off', // 允许使用 interface 和 type 定义
			'@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false, fixStyle: 'inline-type-imports' }],
			'@typescript-eslint/explicit-function-return-type': 'off', // 要求对函数和类方法进行显式返回类型
			'@typescript-eslint/explicit-module-boundary-types': 'off', // 要求在导出的函数和类的公共类方法上显式返回和参数类型
			'@typescript-eslint/no-empty-function': [
				'error',
				{
					allow: ['arrowFunctions', 'functions', 'methods']
				}
			],
			'@typescript-eslint/no-explicit-any': 'off', // 允许 any 类型
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				// 可以自定义始终允许豁免的名称
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			'@typescript-eslint/no-use-before-define': 'off',
			'@typescript-eslint/no-var-requires': 'error'
		}
	});
}
