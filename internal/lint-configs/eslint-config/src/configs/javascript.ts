import type { Linter } from 'eslint';

import js from '@eslint/js';
// 查找并删除未使用的 es6 模块导入
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export async function javascript(): Promise<Linter.Config[]> {
	return [
		{
			languageOptions: {
				ecmaVersion: 'latest',
				// 启用浏览器、Node、ES2021环境的全局变量
				globals: {
					...globals.browser,
					...globals.node,
					...globals.es2021,
					document: 'readonly',
					navigator: 'readonly',
					window: 'readonly'
				},
				parserOptions: {
					ecmaFeatures: {
						jsx: true
					},
					ecmaVersion: 'latest',
					sourceType: 'module'
				}
			},
			linterOptions: {
				reportUnusedDisableDirectives: true
			},
			plugins: {
				'unused-imports': pluginUnusedImports
			},
			rules: {
				...js.configs.recommended.rules,
				'accessor-pairs': ['error', { enforceForClassMembers: true, setWithoutGet: true }], // 强制getter/setter成对出现
				'array-callback-return': 'error', // 强制数组方法的回调函数中有return语句
				'block-scoped-var': 'error',
				'default-case-last': 'error', // switch语句中default的位置应该放在最后
				eqeqeq: 'error', // 要求使用全等
				'new-cap': ['error', { capIsNew: false, newIsCap: true, properties: true }],

				'no-const-assign': 'error', // 禁止修改const声明的变量
				'no-empty': ['error', { allowEmptyCatch: true }],
				'no-empty-character-class': 'error',
				'no-empty-function': 'off',
				'no-empty-pattern': 'error',
				'no-restricted-properties': [
					'error',
					{
						// 使用`Object.getPrototypeOf` or `Object.setPrototypeOf` 替代 `__proto__`
						message: 'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.',
						property: '__proto__'
					},
					{
						message: 'Use `Object.defineProperty` instead.',
						property: '__defineGetter__'
					},
					{
						message: 'Use `Object.defineProperty` instead.',
						property: '__defineSetter__'
					},
					{
						message: 'Use `Object.getOwnPropertyDescriptor` instead.',
						property: '__lookupGetter__'
					},
					{
						message: 'Use `Object.getOwnPropertyDescriptor` instead.',
						property: '__lookupSetter__'
					}
				],
				'no-undef': 'off',
				'no-undef-init': 'error',
				// 'no-restricted-globals': [
				//   'error',
				// ],

				'no-unused-expressions': [
					'error',
					{
						allowShortCircuit: true,
						allowTaggedTemplates: true,
						allowTernary: true
					}
				],
				// js 中 未使用的变量 规则
				'no-unused-vars': [
					'warn',
					{
						args: 'none',
						caughtErrors: 'none',
						// 是否自动清除未使用的导入
						ignoreRestSiblings: true,
						vars: 'all'
					}
				],
				'no-use-before-define': ['error', { classes: false, functions: false, variables: true }],
				'no-var': 'error', // 禁止使用var声明变量
				'no-with': 'error',
				'object-shorthand': ['error', 'always', { avoidQuotes: true, ignoreConstructors: false }],
				'prefer-arrow-callback': [
					'error',
					{
						allowNamedFunctions: false,
						allowUnboundThis: true
					}
				],
				'prefer-const': [
					'error',
					{
						destructuring: 'all',
						ignoreReadBeforeAssign: true
					}
				],
				// eslint-plugin-unused-imports 插件 的 规则
				'unused-imports/no-unused-imports': 'error',
				'unused-imports/no-unused-vars': [
					'warn',
					{
						args: 'after-used',
						argsIgnorePattern: '^_',
						vars: 'all',
						varsIgnorePattern: '^_'
					}
				]
			}
		}
	];
}
