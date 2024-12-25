import type { PluginOption } from 'vite';

/**
 * 自定义启动打印输出插件
 */
async function vitePrintPlugin(): Promise<PluginOption> {
	return {
		name: 'vite-plugin:print',
		configureServer(server) {}
	};
}
