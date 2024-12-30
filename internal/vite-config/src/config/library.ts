import { defineConfig, mergeConfig, type UserConfig } from 'vite';
import type { DefineLibraryOptions } from '../types';
import { defineCommonConfig } from './common';
import { loadLibraryPlugins } from '../plugins';

/**
 * @description: Library configuration (库模式 配置)
 * @param {DefineLibraryOptions} userConfigPromise 用户配置函数
 */
function defineLibraryConfig(userConfigPromise?: DefineLibraryOptions) {
	return defineConfig(async (config) => {
		const options = (await userConfigPromise?.(config)) || {};
		// 解构用户配置
		const { vite = {}, library = {} } = options || {};
		const { command } = config;
		const isBuild = command === 'build';

		const plugins = await loadLibraryPlugins({
			dts: true,
			isBuild,
			...library
		});

		const libraryConfig: UserConfig = {
			plugins
		};

		// 合并通用和默认库配置 mergeConfig
		const mergeCommonConfig = mergeConfig(await defineCommonConfig(), libraryConfig);
		// 合并用户自定义配置
		return mergeConfig(mergeCommonConfig, vite);
	});
}
export { defineLibraryConfig };
