import type { PluginOption } from 'vite';

import { dateUtil, findMonorepoRoot, getPackagesAsync, readPackageJSON } from '@vbird/node-utils';

import { readWorkspaceManifest } from '@pnpm/workspace.read-manifest';

/**
 * @description 解析依赖版本
 * @param pkgsMeta 包的元信息
 * @param name 依赖名
 * @param value 依赖协议
 * @param catalog 目录
 */
function resolvePackageVersion(pkgsMeta: Record<string, string>, name: string, value: string, catalog: Record<string, string>) {
	if (value.includes('catalog:')) {
		return catalog[name];
	}
	if (value.includes('workspace')) {
		return pkgsMeta[name];
	}
	return value;
}

/**
 * @description 解析monorepo依赖, 获取所有包的依赖信息
 */
async function resolveMonorepoDependencies() {
	// 获取大仓中的所有包
	const { packages } = await getPackagesAsync();
	// console.log('getPackagesAsync-->', await getPackagesAsync());
	// 读取 pnpm-workspace.yaml 文件内容
	const manifest = await readWorkspaceManifest(findMonorepoRoot());
	// console.log('manifest --->', manifest);
	// 获取文件中的 catalog 目录信息 （记录的包名和版本）
	const catalog = manifest?.catalog || {};

	// 开发依赖信息
	const devDependenciesData: Record<string, string | undefined> = {};
	// 依赖信息
	const dependenciesData: Record<string, string | undefined> = {};
	// 包的元信息
	const pkgsMeta: Record<string, string> = {};

	// 遍历所有包，读取其 package.json 文件内容，获取包名和版本号
	for (const { packageJson } of packages) {
		pkgsMeta[packageJson.name] = packageJson.version;
	}
	// 遍历所有包，读取其 package.json 文件内容，获取依赖信息
	for (const { packageJson } of packages) {
		const { dependencies = {}, devDependencies = {} } = packageJson;
		for (const [key, value] of Object.entries(dependencies)) {
			dependenciesData[key] = resolvePackageVersion(pkgsMeta, key, value, catalog);
		}
		for (const [key, value] of Object.entries(devDependencies)) {
			devDependenciesData[key] = resolvePackageVersion(pkgsMeta, key, value, catalog);
		}
	}

	return {
		dependencies: dependenciesData,
		devDependencies: devDependenciesData
	};
}

/**
 * 注入项目信息插件
 */
async function viteInjectMetadataPlugin(root = process.cwd()): Promise<PluginOption | undefined> {
	// 读取package.json信息
	const { author, description, homepage, license, version } = await readPackageJSON(root);
	// 构建时间
	const buildTime = dateUtil().format('YYYY-MM-DD HH:mm:ss');

	return {
		// tip: 用户插件在运行这个钩子之前会被解析，因此在 config 钩子中注入其他插件不会有任何效果
		async config() {
			// 获取大仓所有包的依赖信息
			const { dependencies, devDependencies } = await resolveMonorepoDependencies();

			const isAuthorObject = typeof author === 'object';
			const authorName = isAuthorObject ? author.name : author;
			const authorEmail = isAuthorObject ? author.email : null;
			const authorUrl = isAuthorObject ? author.url : null;

			return {
				define: {
					__VBIRD_ADMIN_METADATA__: JSON.stringify({
						authorEmail,
						authorName,
						authorUrl,
						buildTime,
						dependencies,
						description,
						devDependencies,
						homepage,
						license,
						version
					}),
					'import.meta.env.VITE_APP_VERSION': JSON.stringify(version)
				}
			};
		},
		enforce: 'post',
		name: 'vite-plugin:inject-metadata'
	};
}

export { viteInjectMetadataPlugin };
