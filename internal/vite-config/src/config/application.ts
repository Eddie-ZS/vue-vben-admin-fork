import type { CSSOptions, UserConfig } from 'vite';

import type { DefineApplicationOptions } from '../types';

import path, { relative } from 'node:path';

import { findMonorepoRoot } from '@vbird/node-utils';

import { NodePackageImporter } from 'sass';
import { defineConfig, loadEnv, mergeConfig } from 'vite';

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
		const { application = {}, vite = {} } = options || {};
		// 读取应用环境变量配置
		const { base, port } = await loadAndConvertEnv();
		const { command, mode } = config;
		const root = process.cwd();
		const isBuild = command === 'build';
		const env = loadEnv(mode, root);

		// 加载应用默认插件
		const plugins = await loadApplicationPlugins({
			archiver: false,
			compress: true,
			devtools: true,
			env,
			extraAppConfig: true,
			html: true,
			i18n: false,
			importmap: false,
			info: true,
			injectAppLoading: false,
			injectMetadata: true,
			isBuild,
			license: true,
			nitroMock: false,
			print: true,
			printInfoMap: {
				'Vbird Admin Doc': 'https://doc.vben.pro'
			},
			pwa: false,
			visualizer: false,
			vxeTableLazyImport: false,
			...application
		});

		// 是否注入全局scss
		const { injectGlobalScss = true } = application;

		// 默认应用配置
		const applicationConfig: UserConfig = {
			base,
			build: {
				rollupOptions: {
					// 将js，css这些资源目录分别打包到对应的文件夹下
					output: {
						assetFileNames: 'assets/[ext]/[name].[hash].[ext]', // 资源文件像 字体，图片等
						// js分包优化
						chunkFileNames: (chunkInfo) => {
							const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
							const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
							return `assets/js/${fileName}/[name].[hash].js`;
						},
						entryFileNames: 'assets/js/index-[name].[hash].js' // 包的入口文件名称
					}
				},
				target: 'es2015'
			},
			css: createCssOptions(injectGlobalScss),
			plugins,
			server: {
				host: true,
				open: false,
				port,
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

/**
 * @param injectGlobalScss 是否注入全局scss
 */
function createCssOptions(injectGlobalScss: boolean): CSSOptions {
	const root = findMonorepoRoot();
	return {
		preprocessorOptions: injectGlobalScss
			? {
					scss: {
						// source 为 组件样式中的 样式内容，filename 为 组件样式文件路径
						additionalData: (source, filename) => {
							// 获取样式组件的相对路径
							// filename: E:/study/vbird-admin/vue-vbird-admin-fork/apps/web-element/src/App.vue
							// relativePath: apps/web-element/src/App.vue
							const relativePath = relative(root, filename);
							if (relativePath.startsWith(`apps${path.sep}`)) {
								return `@use "@vbird/styles/global" as *;\n${source}`;
							}
							return source;
						},
						api: 'modern',
						// @sse https://sass-lang.com/documentation/js-api/classes/nodepackageimporter/
						//内置的 Node.js 包导入器。这将根据标准 Node.js resolutionalgorithm 从 node_modules 加载 @use "pkg:URL"
						importers: [new NodePackageImporter()]
					}
				}
			: {}
	};
}

export { defineApplicationConfig };
