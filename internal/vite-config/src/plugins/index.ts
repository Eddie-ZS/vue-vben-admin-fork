import type { PluginOption } from 'vite';

import type { ApplicationPluginOptions, CommonPluginOptions, ConditionPlugin, LibraryPluginOptions } from '../types';

import viteVueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import viteVue from '@vitejs/plugin-vue';
import viteVueJsx from '@vitejs/plugin-vue-jsx';
import viteVisualizer from 'rollup-plugin-visualizer';
import viteCompressPlugin from 'vite-plugin-compression';
import viteDtsPlugin from 'vite-plugin-dts';
import { createHtmlPlugin as viteHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import viteVueDevTools from 'vite-plugin-vue-devtools';

import { viteArchiverPlugin } from './archiver';
import { viteExtraAppConfigPlugin } from './extra-app-config';
import { viteBuildInfo } from './info';
import { viteInjectAppLoadingPlugin } from './inject-app-loading';
import { viteInjectMetadataPlugin } from './inject-metadata';
import { viteLicensePlugin } from './license';
import { vitePrintPlugin } from './print';

/**
 * @description 获取条件成立的 vite 插件
 * @param {ConditionPlugin[]} conditionPlugins 条件插件列表
 */
async function loadConditionPlugins(conditionPlugins: ConditionPlugin[]): Promise<PluginOption[]> {
	const plugins: PluginOption[] = [];
	for (const conditionPlugin of conditionPlugins) {
		if (conditionPlugin.condition) {
			plugins.push(...(await conditionPlugin.plugins()));
		}
	}
	return plugins.flat();
}

/**
 * @description 根据条件获取通用的vite插件
 * @param {CommonPluginOptions} options 通用插件选项
 */
async function loadCommonPlugins(options: CommonPluginOptions): Promise<ConditionPlugin[]> {
	const { devtools, injectMetadata, isBuild, visualizer } = options;
	return [
		// vue、tsx插件
		{
			condition: true,
			plugins: () => [viteVue(), viteVueJsx()]
		},
		{
			condition: !isBuild && devtools,
			plugins: () => [viteVueDevTools()]
		},
		{
			condition: injectMetadata,
			plugins: async () => [await viteInjectMetadataPlugin()]
		},
		{
			condition: isBuild && !!visualizer,
			plugins: () => [<PluginOption>viteVisualizer({ filename: './node_modules/.cache/visualizer/stats.html', gzipSize: true, open: true })]
		}
	];
}

/**
 * @description 根据条件获取应用类型的vite插件
 * @param {ApplicationPluginOptions} options 应用插件选项
 */
async function loadApplicationPlugins(options: ApplicationPluginOptions): Promise<PluginOption[]> {
	// 单独取出，不然会导致 commonOptions 无法读取
	const { env, isBuild } = options;
	const {
		archiver,
		archiverPluginOptions,
		compress,
		compressTypes,
		extraAppConfig,
		html,
		i18n,
		importmap,
		importmapOptions,
		info,
		injectAppLoading,
		license,
		nitroMock,
		nitroMockOptions,
		print,
		printInfoMap,
		pwa,
		pwaOptions,
		vxeTableLazyImport,
		...commonOptions
	} = options;

	const commonPlugins = await loadCommonPlugins(commonOptions);
	return await loadConditionPlugins([
		...commonPlugins,
		//  i18n 的 locale 消息插件，提高 vue-i18n 的性能 @see https://www.npmjs.com/package/@intlify/unplugin-vue-i18n
		{
			condition: i18n,
			plugins: () => [
				viteVueI18nPlugin({
					compositionOnly: true,
					fullInstall: true,
					runtimeOnly: true
				})
			]
		},
		// 开启控制台自定义打印插件
		{
			condition: print,
			plugins: () => [vitePrintPlugin({ infoMap: printInfoMap })]
		},
		// 开启项目构建时间自定义输出
		{
			condition: info,
			plugins: async () => [await viteBuildInfo()]
		},
		// vxetable 按需导入插件
		{
			condition: vxeTableLazyImport,
			plugins: async () => []
		},
		// mock plugin
		{
			condition: nitroMock,
			plugins: () => []
		},
		// loading plugin
		{
			condition: injectAppLoading,
			plugins: async () => [await viteInjectAppLoadingPlugin(!!isBuild, env)]
		},
		// 是否注入版权信息插件
		{
			condition: license,
			plugins: async () => [await viteLicensePlugin()]
		},
		// pwa 插件 @see https://vite-pwa-org-zh.netlify.app/guide/
		{
			condition: pwa,
			plugins: () => [
				VitePWA({
					injectRegister: null,
					...pwaOptions
				})
			]
		},
		// 是否开启html插件
		{
			condition: html,
			plugins: () => [viteHtmlPlugin({ minify: true })]
		},
		// 是否开启 importmap CDN
		{
			condition: isBuild && importmap,
			plugins: () => {
				return [];
			}
		},
		// 构建抽离配置文件插件
		{
			condition: isBuild && extraAppConfig,
			plugins: async () => [await viteExtraAppConfigPlugin()]
		},
		// 文件压缩插件
		{
			condition: archiver,
			plugins: async () => [await viteArchiverPlugin(archiverPluginOptions)]
		},
		// 压缩插件
		{
			condition: isBuild && !!compress,
			plugins: () => {
				const compressPlugins: PluginOption[] = [];
				if (compressTypes?.includes('brotli')) {
					compressPlugins.push(viteCompressPlugin({ deleteOriginFile: false, ext: '.br' }));
				}
				if (compressTypes?.includes('gzip')) {
					compressPlugins.push(viteCompressPlugin({ deleteOriginFile: false, ext: '.gz' }));
				}
				return compressPlugins;
			}
		}
	]);
}

/**
 * @description 根据条件获取库类型的vite插件
 * @param {LibraryPluginOptions} options 库插件选项
 */
async function loadLibraryPlugins(options: LibraryPluginOptions): Promise<PluginOption[]> {
	const isBuild = options.isBuild;
	const { dts, ...commonOptions } = options;
	const commonPlugins = await loadCommonPlugins(commonOptions);
	return await loadConditionPlugins([
		...commonPlugins,
		// 一个 Vite 插件，当在库模式下使用 Vite 时，它会从 .ts（x） 或 .vue 源文件生成声明文件 （*.d.ts）
		{
			condition: isBuild && !!dts,
			plugins: () => [
				viteDtsPlugin({
					logLevel: 'error'
				})
			]
		}
	]);
}

export { loadApplicationPlugins, loadLibraryPlugins };
