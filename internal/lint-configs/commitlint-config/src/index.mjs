import { getPackagesSync } from '@vbird/node-utils';
const { packages } = getPackagesSync();

const allowScopedPackages = [...packages.map((pkg) => pkg.packageJson.name), 'ci'];

// /** @type {import('czg').UserConfig} */
/** @type {import('cz-git').UserConfig} */
const userConfig = {
	extends: ['@commitlint/config-conventional'],
	plugins: ['commitlint-plugin-function-rules'], // 使用函数作为规则值。
	rules: {
		/**
		 *  condition: 提交的body以value结尾
		 *  rule: never 默认为never，提交信息不以.结尾
		 *  value: 默认值.
		 */
		'body-leading-blank': [2, 'always'],

		/**
		 * condition: footer 是否以空行开始
		 * rule: always
		 */
		'footer-leading-blank': [1, 'always'],

		/**
		 * condition: header 最大长度
		 * rule: always
		 * value: 72 默认72个字符
		 */
		'header-max-length': [2, 'always', 108],

		/**
		 * condition: 影响范围scope 的枚举，提交信息时只能从中选择
		 * rule: always
		 * value: []
		 */
		'scope-enum': [0],

		/**
		 * description: type 的输入格式
		 * rule: always
		 * value:'lower-case'，默认为小写，可选列表同上
		 */
		'subject-case': [0],

		/**
		 * condition: subject 是否为空
		 * rule: never
		 */
		'subject-empty': [2, 'never'],

		/**
		 * condition: type 是否可为空
		 * rule: never
		 */
		'type-empty': [2, 'never'],
		/**
		 * condition: 影响范围scope 的枚举，提交信息时只能从中选择
		 * rule: always
		 * value: []
		 */
		'function-rules/scope-enum': [
			2, // level: error
			'always',
			(parsed) => {
				if (!parsed.scope || allowScopedPackages.includes(parsed.scope)) {
					return [true];
				}

				return [false, `scope must be one of ${allowScopedPackages.join(', ')}`];
			}
		],

		// 类型枚举，git提交type必须是以下类型
		'type-enum': [
			// 当前验证的错误级别
			2,
			// 在什么情况下进行验证，always表示一直进行验证
			'always',
			[
				'feat', // 新增功能
				'fix', // 修复缺陷
				'docs', // 文档变更
				'style', // 代码格式（不影响功能，例如空格、分号等格式修正）
				'refactor', // 代码重构（不包括 bug 修复、功能新增）
				'perf', // 性能优化
				'test', // 添加疏漏测试或已有测试改动
				'build', // 构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）
				'ci', // 修改 CI 配置、脚本
				'revert', // 回滚 commit
				'chore' // 对构建过程或辅助工具和库的更改（不影响源文件、测试用例）
			]
		]
	},
	prompt: {}
};
export default userConfig;
