import { execSync } from 'node:child_process';
import { getPackagesSync } from '@vbird/node-utils';
const { packages } = getPackagesSync();

// scope-enum, 提交信息时的scope选项只能从中选择
const allowScopedPackages = [...packages.map((pkg) => pkg.packageJson.name), 'project', 'style', 'lint', 'ci', 'dev', 'deploy', 'other'];

// precomputed scope
// 自动获取 “代码修改范围”。 适用于存在很多范围选项（例如组件库、monorepo）的情况
const scopeComplete = execSync('git status --porcelain || true')
	.toString()
	.trim()
	.split('\n')
	.find((r) => ~r.indexOf('M  src'))
	?.replace(/(\/)/g, '%%')
	?.match(/src%%((\w|-)*)/)?.[1];

/** @type {import('cz-git').UserConfig} */
const userConfig = {
	extends: ['@commitlint/config-conventional'],
	plugins: ['commitlint-plugin-function-rules'], // 使用函数作为规则值。
	/***
	 * 规则配置
	 * 0：禁用规则 1：警告 2：错误
	 * always：某项规则必须满足，不满足则会触发错误或警告  -> 是
	 * never：某些规则不能被满足，满足则会触发错误或警告 -> 否
	 */
	rules: {
		/**
		 * condition: body 以空行开头
		 */
		'body-leading-blank': [2, 'always'],

		/**
		 * condition: footer 以空行开始
		 */
		'footer-leading-blank': [1, 'always'],

		/**
		 * condition: 标头 header 最大长度
		 * value: 72 默认72个字符 不超过72个字符
		 */
		'header-max-length': [2, 'always', 108],

		/**
		 * condition: 关闭默认的，使用插件函数的scope-enum
		 */
		'scope-enum': [0],

		/**
		 * description: 忽略提交信息主体的大小写
		 */
		'subject-case': [0],

		/**
		 * condition: subject 不能为空
		 */
		'subject-empty': [2, 'never'],

		/**
		 * condition: type 不能为空
		 */
		'type-empty': [2, 'never'],
		/**
		 * condition: 影响范围scope 的枚举，提交信息时只能从中选择
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

		/**
		 * 类型枚举，git提交type必须是以下类型
		 */
		'type-enum': [
			// 当前验证的错误级别
			2,
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
				'chore', // 对构建过程或辅助工具和库的更改（不影响源文件、测试用例）
				'types' // 类型定义文件修改
			]
		]
	},
	prompt: {
		// 用来定义一些常用的git commit message。
		/** @use czg :b | czg --alias=b | pnpm commit :b */
		alias: {
			b: 'build: bump dependencies',
			c: 'chore: update config',
			s: 'style: format code'
		},

		allowCustomIssuePrefix: false, // 是否允许自定义issue前缀
		allowEmptyIssuePrefix: false, // 是否允许空issue前缀
		customScopesAlign: scopeComplete ? 'bottom' : 'top',
		defaultScope: scopeComplete,

		// 中英文 配置模板
		messages: {
			type: '选择你要提交的类型 :',
			scope: '选择一个提交范围（可选）:',
			customScope: '请输入自定义的提交范围 :',
			subject: '填写简短精炼的变更描述 :\n',
			body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
			breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
			footerPrefixesSelect: '选择关联issue前缀（可选）:',
			customFooterPrefix: '输入自定义issue前缀 :',
			footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',
			confirmCommit: '是否提交或修改commit ?'
		},
		types: [
			{ value: 'feat', name: 'feat:     新增功能 | A new feature' },
			{ value: 'fix', name: 'fix:      修复缺陷 | A bug fix' },
			{ value: 'docs', name: 'docs:     文档更新 | Documentation only changes' },
			{ value: 'style', name: 'style:     代码格式 | Changes that do not affect the meaning of the code' },
			{ value: 'refactor', name: 'refactor:     代码重构 | A code change that neither fixes a bug nor adds a feature' },
			{ value: 'perf', name: 'perf:     性能提升 | A code change that improves performance' },
			{ value: 'test', name: 'test:     测试相关 | Adding missing tests or correcting existing tests' },
			{ value: 'build', name: 'build:    构建相关 | Changes that affect the build system or external dependencies' },
			{ value: 'ci', name: 'ci:       持续集成 | Changes to our CI configuration files and scripts' },
			{ value: 'revert', name: 'revert:   回退代码 | Revert to a commit' },
			{ value: 'chore', name: 'chore:    其他修改 | Other changes that do not modify src or test files' },
			{ value: 'types', name: 'type:    类型定义文件修改 | The type definition file is modified' }
		]
	}
};
export default userConfig;
