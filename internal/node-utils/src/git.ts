import { execa } from 'execa';
import path from 'node:path';

export * from '@changesets/git';

/**
 * 获取当前git存储库中的暂存文件列表
 */
async function getStagedFiles(): Promise<string[]> {
	try {
		const { stdout } = await execa('git', [
			'--cached',
			'submodule.recurse=false',
			'diff',
			'--name-only',
			'--staged',
			'--diff-filter=ACMR',
			'--ignore-submodules',
			'-z'
		]);

		let changedList = stdout ? stdout.replace(/\0$/, '').split('\0') : [];
		changedList = changedList.map((item) => path.resolve(process.cwd(), item));
		const changedSet = new Set(changedList);
		changedSet.delete('');
		return [...changedSet];
	} catch (error) {
		console.error('Failed to get staged files:', error);
		return [];
	}
}

export { getStagedFiles };
