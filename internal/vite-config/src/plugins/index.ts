import viteVue from '@vitejs/plugin-vue';
import viteVueJsx from '@vitejs/plugin-vue-jsx';
import viteVueDevTools from 'vite-plugin-vue-devtools';
import viteVisualizer from 'rollup-plugin-visualizer';
import viteCompressPlugin from 'vite-plugin-compression';

import type { PluginOption } from 'vite';
import type { ApplicationPluginOptions, CommonPluginOptions, LibraryPluginOptions, ConditionPlugin } from '../types';

/**
 * 获取条件成立的 vite 插件
 */
async function loadConditionPlugins(conditionPlugins: ConditionPlugin[]) {
	const plugins: PluginOption[] = [];
	for (const conditionPlugin of conditionPlugins) {
		if (conditionPlugin.condition) {
			plugins.push(...(await conditionPlugin.plugins()));
		}
	}
	return plugins.flat();
}

/**
 * 根据条件获取通用的vite插件
 */
async function loadCommonPlugins(options: CommonPluginOptions): Promise<ConditionPlugin[]> {
	const { isBuild, injectMetadata, visualizer, devtools } = options;
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
			plugins: async () => []
		},
		{
			condition: isBuild && !!visualizer,
			plugins: () => [<PluginOption>viteVisualizer({ filename: './node_modules/.cache/visualizer/stats.html', gzipSize: true, open: true })]
		}
	];
}

/**
 * 根据条件获取应用类型的vite插件
 */
async function loadApplicationPlugins(options: ApplicationPluginOptions): Promise<PluginOption[]> {
	// 单独取出，不然会导致 commonOptions 无法读取
	const { isBuild, env } = options;
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
 * 根据条件获取库类型的vite插件
 */
async function loadLibraryPlugins(options: LibraryPluginOptions): Promise<PluginOption[]> {
	const isBuild = options.isBuild;
	const { dts, ...commonOptions } = options;
	const commonPlugins = await loadCommonPlugins(options);
	return await loadConditionPlugins([...commonPlugins]);
}

export { loadApplicationPlugins, loadLibraryPlugins };
