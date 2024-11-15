import { dirname } from 'node:path';

// 从monorepo获取包
import { getPackages as getPackagesAsyncFunc, getPackagesSync as getPackagesSyncFunc } from '@manypkg/get-packages';

// find-up 通过向上浏览父目录来查找文件或目录
import { findUpSync } from 'find-up';

/**
 * 查找大仓根目录
 * @param cwd 默认值 process.cwd() 根目录
 */
function findMonorepoRoot(cwd: string = process.cwd()) {
	// findUpSync 通过指定文件查询所在目录 返回 D:\my\vue\vben-admin\vue-vben-admin-fork\pnpm-lock.yaml
	const lockFile = findUpSync(['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock'], {
		cwd,
		type: 'file'
	});
	// dirname 解析出 文件 所在的 目录路径   D:\my\vue\vben-admin\vue-vben-admin-fork
	return dirname(lockFile || '');
}

/**
 * 同步获取大仓所有包
 */
function getPackagesSync() {
	const root = findMonorepoRoot();
	return getPackagesSyncFunc(root);
}

/**
 * 异步获取大仓所有包
 */
async function getPackagesAsync() {
	const root = findMonorepoRoot();
	return await getPackagesAsyncFunc(root);
}

/**
 * 获取大仓指定的包
 * @param name 包名
 */
async function getPackage(name: string) {
	const { packages } = await getPackagesAsync();
	return packages.find((pkg) => pkg.packageJson.name === name);
}

export { findMonorepoRoot, getPackagesSync, getPackagesAsync, getPackage };
