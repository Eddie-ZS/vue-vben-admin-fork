import { defineConfig, loadEnv, mergeConfig, type UserConfig } from 'vite';
import type { DefineApplicationOptions } from '../types';
import { loadApplicationPlugins } from '../plugins';
import { loadAndConvertEnv } from '../utils/env';
import { defineCommonConfig } from './common';

/**
 * @description: Application configuration (应用模式 配置)
 * @param {DefineApplicationOptions} userConfigPromise 用户配置函数
 */
function defineApplicationConfig(userConfigPromise?: DefineApplicationOptions) {
	return defineConfig(async (config) => {
		// 加载用户自定义配置
		const options = await userConfigPromise?.(config);
		// 解构用户配置
		const { vite = {}, application = {} } = options || {};
		// 读取应用环境变量配置
		const { base, port } = await loadAndConvertEnv();
		const { mode, command } = config;
		const root = process.cwd();
		const isBuild = command === 'build';
		const env = loadEnv(mode, root);

		// 加载应用默认插件
		const plugins = await loadApplicationPlugins({
			devtools: true,
			i18n: false,
			html: true,
			info: true,
			print: true,
			printInfoMap: {
				'Vben Admin Doc': 'https://doc.vben.pro'
			},
			vxeTableLazyImport: false,
			nitroMock: false,
			injectMetadata: false,
			injectAppLoading: false,
			license: true,
			pwa: false,
			importmap: false,
			extraAppConfig: false,
			archiver: false,
			compress: true,
			visualizer: false,
			env,
			isBuild,
			...application
		});

		// 是否注入全局scss
		const { injectGlobalScss = true } = application;

		// 默认应用配置
		const applicationConfig: UserConfig = {
			base,
			plugins,
			build: {
				target: 'es2015',
				rollupOptions: {
					// 将js，css这些资源目录分别打包到对应的文件夹下
					output: {
						entryFileNames: 'assets/js/index-[name].[hash].js', // 包的入口文件名称
						assetFileNames: 'assets/[ext]/[name].[hash].[ext]', // 资源文件像 字体，图片等
						// js分包优化
						chunkFileNames: (chunkInfo) => {
							const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
							const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
							return `assets/js/${fileName}/[name].[hash].js`;
						}
					}
				}
			},
			server: {
				host: true,
				port,
				open: false,
				warmup: {
					// 预加载文件
					clientFiles: ['./index.html', './src/bootstrap.ts', './src/{views,layouts,router,store,api,adapter}/*']
				}
			}
		};
		// 合并通用和默认应用配置 mergeConfig
		const mergeCommonConfig = mergeConfig(await defineCommonConfig(), applicationConfig);
		// 合并用户自定义配置
		return mergeConfig(mergeCommonConfig, vite);
	});
}

export { defineApplicationConfig };
