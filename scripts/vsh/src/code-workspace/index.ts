import type { CAC } from 'cac';

import { join } from 'node:path';

import { colors, consola, findMonorepoRoot, getPackagesAsync, gitAdd, outputJson, prettierFormat, toPosixPath } from '@vbird/node-utils';

const CODE_WORKSPACE_FILE_NAME = join('vbird-admin.code-workspace');

interface CodeWorkSpaceOptions {
	autoCommit: boolean;
	indent: number;
}

/**
 * 创建 code-workspace 代码工作空间文件
 */
async function createCodeWorkSpace({ autoCommit = false, indent = 2 }: CodeWorkSpaceOptions) {
	// 读取仓库中所有 package.json 文件
	const { packages } = await getPackagesAsync();
	// 生成 code-workspace 文件内容
	let folders = packages.map((pkg) => {
		const { packageJson, relativeDir } = pkg;
		// console.log('relativeDir-->', pkg.relativeDir);
		// console.log('dir-->', dir);
		// 转为相对路径, 并转为 posix 格式
		// console.log('posixPath-->', toPosixPath(relative(rootDir, dir)));
		return {
			name: packageJson.name,
			path: toPosixPath(relativeDir)
		};
	});
	// 过滤空值
	folders = folders.filter(Boolean);

	// 获取 monorepo 根目录
	const monorepoRoot = findMonorepoRoot();
	// 生成 code-workspace 文件地址
	const outputPath = join(monorepoRoot, CODE_WORKSPACE_FILE_NAME);
	// 输入内容 到 .code-workspace 文件中
	await outputJson(outputPath, { folders }, indent);
	// 使用 prettier 格式化 .code-workspace 文件
	await prettierFormat(outputPath);
	if (autoCommit) {
		// 添加 .code-workspace 文件到暂存区
		await gitAdd(CODE_WORKSPACE_FILE_NAME, monorepoRoot);
	}
}

async function runCodeWorkSpace({ autoCommit, indent }: CodeWorkSpaceOptions) {
	await createCodeWorkSpace({ autoCommit, indent });
	if (autoCommit) {
		return;
	}
	consola.log('');
	consola.success(colors.green(`${CODE_WORKSPACE_FILE_NAME} generated successfully.`));
	consola.log('');
}

/**
 * 生成 code-workspace 代码工作空间文件脚本
 */
async function defineCodeWorkSpaceCommand(cac: CAC) {
	cac
		.command('code-workspace')
		.usage('Update the `.code-workspace` file')
		// 行缩进字符
		.option('--indent [number]', '.code-workspace JSON file indent.', {
			default: 2
		})
		// 是否提交时自动生成.code-workspace JSON 文件
		.option('--auto-commit', 'auto commit .code-workspace JSON file.', {
			default: false
		})
		.action(runCodeWorkSpace);
}

export { defineCodeWorkSpaceCommand };
