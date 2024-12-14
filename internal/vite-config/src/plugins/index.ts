import type { PluginOption } from 'vite';
import type { ApplicationPluginOptions, LibraryPluginOptions } from '../types';

/**
 * 根据条件获取应用类型的vite插件
 */
async function loadApplicationPlugins(options: ApplicationPluginOptions): Promise<PluginOption[]> {
	return await [];
}

/**
 * 根据条件获取库类型的vite插件
 */
async function loadLibraryPlugins(options: LibraryPluginOptions): Promise<PluginOption[]> {
	return await [];
}
