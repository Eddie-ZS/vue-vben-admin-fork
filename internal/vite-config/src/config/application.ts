import { defineConfig, type UserConfig } from 'vite';
import type { DefineApplicationOptions } from '../types';
import { loadApplicationPlugins } from '../plugins';
import { loadAndConvertEnv } from '../utils/env';

/**
 * @description: Application configuration (应用模式 配置)
 * @param {DefineApplicationOptions} userConfigPromise 用户配置函数
 */
function defineApplicationConfig(userConfigPromise?: DefineApplicationOptions) {
	return defineConfig(async (config) => {
		// 加载用户自定义配置
		const options = await userConfigPromise?.(config);
		// 读取环境变量
		const { base } = await loadAndConvertEnv();
		// 加载应用插件
		const plugins = await loadApplicationPlugins({
			devtools: true
		});

		const applicationConfig: UserConfig = {
			plugins
		};
		// 合并用户配置
		return applicationConfig;
	});
}

export { defineApplicationConfig };
