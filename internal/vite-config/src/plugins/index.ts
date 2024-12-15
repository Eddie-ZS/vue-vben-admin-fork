import viteVue from '@vitejs/plugin-vue';
import viteVueJsx from '@vitejs/plugin-vue-jsx';
import viteVueDevTools from 'vite-plugin-vue-devtools';
import viteVisualizer from 'rollup-plugin-visualizer';

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
	const commonPlugins = await loadCommonPlugins(options);
	return await loadConditionPlugins([...commonPlugins]);
}

/**
 * 根据条件获取库类型的vite插件
 */
async function loadLibraryPlugins(options: LibraryPluginOptions): Promise<PluginOption[]> {
	const commonPlugins = await loadCommonPlugins(options);
	return await loadConditionPlugins([...commonPlugins]);
}

export { loadApplicationPlugins, loadLibraryPlugins };
