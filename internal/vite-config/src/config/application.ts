import { defineConfig } from 'vite';
import type { DefineApplicationOptions } from '../types';

/**
 * @description: Application configuration (应用模式 配置)
 * @param {DefineApplicationOptions} userConfigPromise 用户配置函数
 */
function defineApplicationConfig(userConfigPromise?: DefineApplicationOptions) {
	return defineConfig(async (config) => {
		return config;
	});
}

export { defineApplicationConfig };
