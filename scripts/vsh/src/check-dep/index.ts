import type { CAC } from 'cac';

import { consola, getPackagesAsync } from '@vbird/node-utils';

import depcheck from 'depcheck';

// 忽略检查的包
const IGNORE_PACKAGE_NAME = new Set([
	'@vbird/commitlint-config',
	'@vbird/eslint-config',
	'@vbird/node-utils',
	'@vbird/prettier-config',
	'@vbird/stylelint-config',
	'@vbird/tailwind-config',
	'@vbird/tsconfig',
	'@vbird/vite-config',
	'@vbird/vsh'
]);

async function runDepcheck() {
	// 获取所有包
	const { packages } = await getPackagesAsync();
	Promise.all(
		// 遍历所有包
		packages.map(async (pkg) => {
			// 忽略指定的包
			if (IGNORE_PACKAGE_NAME.has(pkg.packageJson.name)) {
				return;
			}

			/**
			 * 检查项目中未使用的依赖项和未安装的依赖项。
			 * 参数1： 项目的根目录（package.json文件所在的位置）。如果未指定，则默认为当前目录。
			 * 参数2： 配置项。具体配置项请参考depcheck文档。
			 */
			const unused = await depcheck(pkg.dir, {
				//忽略与以下指定包的匹配依赖项
				ignoreMatches: [
					'vite',
					'vitest',
					'unbuild',
					'@vbird/tsconfig',
					'@vbird/vite-config',
					'@vbird/tailwind-config',
					'@vbird-core/design'
				],
				// 忽略与以下路径下的依赖项
				ignorePatterns: ['dist', 'node_modules', 'public']
			});

			// console.log('unused -->', pkg.packageJson.name, 'value:', unused);

			// 查找包含package中丢失（未安装）的依赖项，并清除掉file:前缀的依赖提示，该依赖是本地依赖
			Reflect.deleteProperty(unused.missing, 'file:');
			Object.keys(unused.missing).forEach((key) => {
				// 过滤掉某个依赖下以 / 开头的文件路径
				unused.missing[key] = (unused.missing[key] || []).filter((item) => !item.startsWith('/'));
				// 如果丢失的依赖项下不存在文件路径，则删除该依赖项
				if (unused.missing[key].length === 0) {
					Reflect.deleteProperty(unused.missing, key);
				}
			});

			// 若不存在未使用、未安装的依赖项 则退出
			if (Object.keys(unused.missing).length === 0 && unused.dependencies.length === 0 && unused.devDependencies.length === 0) {
				return;
			}

			// 输出·未使用的依赖、未安装的依赖信息
			consola.error(
				'\n',
				pkg.packageJson.name,
				'\n missing:',
				unused.missing,
				'\n dependencies:',
				unused.dependencies,
				'\n devDependencies:',
				unused.devDependencies
			);
		})
	);
}

/**
 * 未使用、未安装的依赖检查脚本
 * @description 检查整个项目依赖情况，并在控制台输出未使用的依赖、未安装的依赖信息
 */
function defineDepcheckCommand(cac: CAC) {
	cac
		.command('check-dep')
		.usage('Analysis of project circular dependencies.')
		.action(async () => {
			await runDepcheck();
		});
}

export { defineDepcheckCommand };
