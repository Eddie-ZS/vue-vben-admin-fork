import { defineConfig, loadEnv, type UserConfig } from 'vite';
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
		// 解构用户配置
		// const { vite = {}, application = {} } = options || {};
		// 读取应用环境变量配置
		const { base, port } = await loadAndConvertEnv();
		const { mode, command } = config;
		const root = process.cwd();
		const isBuild = command === 'build';
		const env = loadEnv(mode, root);

		// 加载应用默认插件
		const plugins = await loadApplicationPlugins({
			devtools: false,
			html: true,
			env,
			isBuild
		});

		const applicationConfig: UserConfig = {
			base,
			plugins,
			server: {
				host: true,
				port,
				open: false,
				warmup: {}
			}
		};
		// 合并用户配置 mergeConfig
		return applicationConfig;
	});
}

export { defineApplicationConfig };
