import type { CAC } from 'cac';

import { extname } from 'node:path';

import { getStagedFiles } from '@vbird/node-utils';

import { circularDepsDetect, printCircles } from 'circular-dependency-scanner';

interface CommandOptions {
	// 是否只检查git暂存区内的文件
	staged: boolean;
	// 是否显示详细信息
	verbose: boolean;
}

const IGNORE_DIR = [
	'dist',
	'.turbo',
	'output',
	'.cache',
	'scripts',
	'internal',
	'packages/effects/request/src/',
	'packages/@core/ui-kit/menu-ui/src/',
	'packages/@core/ui-kit/popup-ui/src/'
].join(',');

const IGNORE = [`**/${IGNORE_DIR}/**`];

/**
 * 检查项目是否存在循环引用
 */
async function checkCircular({ staged, verbose }: CommandOptions) {
	const results = await circularDepsDetect({
		absolute: staged,
		cwd: process.cwd(),
		ignore: IGNORE
	});

	if (staged) {
		let files = await getStagedFiles();
		// 过滤出有效的文件
		const allowedExtensions = new Set(['.cjs', '.js', '.jsx', '.mjs', '.ts', '.tsx', '.vue']);
		files = files.filter((file) => allowedExtensions.has(extname(file)));

		const circularFiles: Array<string[]> = [];
		// 循环暂存区内的文件
		for (const file of files) {
			// 过滤出循环引用的文件
			for (const result of results) {
				const flatResults = result.flat();
				if (flatResults.includes(file)) circularFiles.push(result);
			}
		}

		verbose && printCircles(circularFiles);
	} else {
		verbose && printCircles(results);
	}
}

/**
 * 循环引用检测脚本
 * @description 检查整个项目循环引用，如果有循环引用，会在控制台输出循环引用的模块。
 */
function defineCheckCircularCommand(cac: CAC) {
	cac
		// 创建命令实例
		.command('check-circular', 'Checking cyclic dependencies')
		// 添加全局选项 --staged 只检查git暂存区内的文件,默认false
		.option('--staged', 'Whether it is the staged commit mode, in which mode, if there is a circular dependency, an alarm will be given.')
		.usage('Analysis of project circular dependencies.')
		// --clear-screen 和 --clearScreen 都映射到 options.clearScreen
		// @see https://www.npmjs.com/package/cac#dash-in-option-names
		.action(async ({ staged }) => {
			await checkCircular({ staged, verbose: true });
		});
}

export { defineCheckCircularCommand };
