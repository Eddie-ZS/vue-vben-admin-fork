import type { PluginOption } from 'vite';
import type { PrintPluginOptions } from '../types';
import { colors } from '@vbird/node-utils';

/**
 * 自定义启动打印输出插件
 * @param options 配置项
 */
function vitePrintPlugin(options: PrintPluginOptions = {}): PluginOption {
	const { infoMap = {} } = options;
	return {
		name: 'vite-plugin:print',
		configureServer(server) {
			// 存储原始的打印输出函数地址
			const _printUrls = server.printUrls;
			server.printUrls = () => {
				// 调用原始的打印输出函数
				_printUrls();
				// 打印自定义信息
				for (const [key, value] of Object.entries(infoMap)) {
					console.log(`  ${colors.green('➜')}  ${colors.bold(key)}: ${colors.cyan(value)}`);
				}
			};
		}
	};
}

export { vitePrintPlugin };
