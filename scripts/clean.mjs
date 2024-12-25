import { boxen, gradient, cristal, vice } from '@vbird/node-utils';
import { readdir, rm, lstat } from 'node:fs/promises';
import { join } from 'node:path';

const rootDir = process.cwd();

// boxen style options
const boxenOptions = {
	padding: 0.5,
	borderColor: 'blue',
	borderStyle: 'round'
};

/**
 * @description 递归删除指定目录下的文件或目录
 * @param {*} currentDir 当前遍历的目录
 * @param {*} targets 需要删除的目录或文件列表
 */
async function cleanTargetsRecursively(currentDir, targets) {
	// 先读取当前目录下的所有文件和目录
	const files = await readdir(currentDir);
	// 遍历当前目录下的所有文件和目录
	for (const file of files) {
		try {
			// 获取当前文件或目录的绝对路径
			const filePath = join(currentDir, file);
			// 如果当前文件或目录是需要删除的目标，则删除
			if (targets.includes(file)) {
				await rm(filePath, { force: true, recursive: true });
				console.log(cristal(`Delete file or directory: ${filePath}`));
			}
			// 如果当前文件或目录是目录，则递归调用本函数
			const stat = await lstat(filePath);
			if (stat.isDirectory()) {
				await cleanTargetsRecursively(filePath, targets);
			}
		} catch {}
	}
}

(async function startCleanup() {
	// 需要删除的目录以及文件
	const targets = ['dist', 'node_modules', '.turbo', 'dist.zip'];

	// 获取命令行参数是否包含选项 --del-lock
	const deleteLockFile = process.argv.includes('--del-lock');
	const cleanTargets = [...targets];
	// 如果选项 --del-lock 存在，则将 pnpm-lock.yaml 加入待删除列表
	if (deleteLockFile) {
		cleanTargets.push('pnpm-lock.yaml');
	}

	console.log(boxen(vice(`Start cleaning the targets: ${cleanTargets.join(', ')} from root: ${rootDir}`), boxenOptions));

	try {
		await cleanTargetsRecursively(rootDir, cleanTargets);
		console.log(boxen(gradient(['pink', 'blue'])(`Cleanup completed!`, boxenOptions)));
	} catch (error) {
		console.error(`Unexpected error during cleanup: ${error.message}`);
	}
})();
