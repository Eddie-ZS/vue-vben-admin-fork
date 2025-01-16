import type { UserConfig } from 'vite';

import type { DefineLibraryOptions } from '../types';

import { readPackageJSON } from '@vbird/node-utils';

import { defineConfig, mergeConfig } from 'vite';

import { loadLibraryPlugins } from '../plugins';
import { defineCommonConfig } from './common';

/**
 * @description: Library configuration (库模式 配置)
 * @param {DefineLibraryOptions} userConfigPromise 用户配置函数
 */
function defineLibraryConfig(userConfigPromise?: DefineLibraryOptions) {
	return defineConfig(async (config) => {
		const options = (await userConfigPromise?.(config)) || {};
		// 解构用户配置
		const { library = {}, vite = {} } = options || {};
		const { command } = config;
		const root = process.cwd();
		const isBuild = command === 'build';

		const plugins = await loadLibraryPlugins({
			dts: true,
			injectMetadata: true,
			isBuild,
			...library
		});

		const { dependencies = {}, peerDependencies = {} } = await readPackageJSON(root);
		const externalPackages = [...Object.keys(dependencies), ...Object.keys(peerDependencies)];

		const libraryConfig: UserConfig = {
			build: {
				lib: {
					entry: 'src/index.ts',
					fileName: () => 'index.mjs',
					formats: ['es']
				},
				rollupOptions: {
					external: (id) => {
						return externalPackages.some((pkg) => id === pkg || id.startsWith(`${pkg}/`));
					}
				}
			},
			plugins
		};

		// 合并通用和默认库配置 mergeConfig
		const mergeCommonConfig = mergeConfig(await defineCommonConfig(), libraryConfig);
		// 合并用户自定义配置
		return mergeConfig(mergeCommonConfig, vite);
	});
}
export { defineLibraryConfig };
