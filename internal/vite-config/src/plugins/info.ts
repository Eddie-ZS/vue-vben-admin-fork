import type { Dayjs } from 'dayjs';
import type { PluginOption } from 'vite';

import type { BoxenOptions } from '@vbird/node-utils';

import { boxen, getPackageSize, gradient } from '@vbird/node-utils';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

// @see https://reports.org.cn/plugin-using/gradient-string/summary#accepted-string-input
const useMessage = gradient(['cyan', 'blue']).multiline(`🚀 Start building the project：${process.env.npm_package_name}`);

// boxen style options
const boxenOptions: BoxenOptions = {
	borderColor: 'blue',
	borderStyle: 'round',
	padding: 0.5
};

/**
 * @description 自定义构建信息输出插件
 */
async function viteBuildInfo(): Promise<PluginOption> {
	let config: { command: 'build' | 'serve' };
	let outputDir: string;
	let startTime: Dayjs;
	let endTime: Dayjs;
	return {
		buildStart() {
			if (config.command === 'build') {
				console.log(boxen(useMessage, boxenOptions));
				startTime = dayjs(new Date());
			}
		},
		async closeBundle() {
			if (config.command === 'build') {
				endTime = dayjs(new Date());
				const size = await getPackageSize({
					folder: outputDir
				});
				console.log(
					boxen(
						gradient(['cyan', 'blue']).multiline(
							`🎉 Construction completed! Consume time:  ${dayjs.duration(endTime.diff(startTime)).format('mm分ss秒')}, Size: ${size}`
						),
						{
							...boxenOptions,
							margin: { bottom: 1, top: 1 }
						}
					)
				);
			}
		},
		configResolved(resolvedConfig) {
			// 存储最终解析的配置
			config = resolvedConfig;
			// 存储输出文件夹
			outputDir = resolvedConfig.build.outDir ?? 'dist';
		},
		name: 'vite-plugin:build-info'
	};
}

export { viteBuildInfo };
