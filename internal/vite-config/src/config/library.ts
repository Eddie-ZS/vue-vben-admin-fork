import { defineConfig } from 'vite';
import type { DefineLibraryOptions } from '../types';

/**
 * @description: Library configuration (库模式 配置)
 * @param {DefineLibraryOptions} userConfigPromise 用户配置函数
 */
function defineLibraryConfig(userConfigPromise?: DefineLibraryOptions) {
	return defineConfig(async (config) => {
		return config;
	});
}

export { defineLibraryConfig };
