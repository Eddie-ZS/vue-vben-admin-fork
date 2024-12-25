import { defineConfig, mergeConfig, type UserConfig } from 'vite';
import type { DefineLibraryOptions } from '../types';
import { defineCommonConfig } from './common';

/**
 * @description: Library configuration (库模式 配置)
 * @param {DefineLibraryOptions} userConfigPromise 用户配置函数
 */
function defineLibraryConfig(userConfigPromise?: DefineLibraryOptions) {
	return defineConfig(async (config) => {
		const options = (await userConfigPromise?.(config)) || {};

		const { vite = {}, library = {} } = options || {};

		const libraryConfig: UserConfig = {};

		// 合并通用和默认库配置 mergeConfig
		const mergeCommonConfig = mergeConfig(await defineCommonConfig(), libraryConfig);
		// 合并用户自定义配置
		return mergeConfig(mergeCommonConfig, vite);
	});
}
export { defineLibraryConfig };
