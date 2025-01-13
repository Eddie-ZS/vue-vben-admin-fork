import type { CAC } from 'cac';

import { execaCommand } from '@vbird/node-utils';

interface LintCommandOptions {
	format?: boolean;
}

async function runLint({ format }: LintCommandOptions) {
	// 执行lint修复
	if (format) {
		await execaCommand('stylelint "**/*.{vue,css,less,scss}" --cache --fix', { stdio: 'inherit' });
		await execaCommand('eslint . --cache --fix', { stdio: 'inherit' });
		await execaCommand('prettier --write --cache --loglevel warn', { stdio: 'inherit' });
		return;
	}
	// 执行lint检查
	await Promise.all([
		execaCommand('eslint . --cache', { stdio: 'inherit' }),
		execaCommand('prettier . --ignore-unknown --cache --check ', { stdio: 'inherit' }),
		execaCommand('stylelint "**/*.{vue,css,less,scss}" --cache', { stdio: 'inherit' })
	]);
}

function defineLintCommand(cac: CAC) {
	cac
		.command('lint')
		// 批量执行项目lint检查
		.usage('Batch execute project lint check.')
		// 添加选项 --format 用于格式化项目中的代码格式问题
		.option('--format', 'Format lint problem in the project.')
		.action(runLint);
}

export { defineLintCommand };
