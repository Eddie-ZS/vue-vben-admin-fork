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
		// 读取应用环境变量配置
		const { base } = await loadAndConvertEnv();
		// 加载应用默认插件
		const plugins = await loadApplicationPlugins({
			devtools: true
		});

		const applicationConfig: UserConfig = {
			plugins
		};
		// 合并用户配置 mergeConfig
		return applicationConfig;
	});
}

export { defineApplicationConfig };
