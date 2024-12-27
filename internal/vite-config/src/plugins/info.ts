import type { PluginOption } from 'vite';
import { gradient, boxen, type BoxenOptions, getPackageSize } from '@vbird/node-utils';
import dayjs, { type Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

// @see https://reports.org.cn/plugin-using/gradient-string/summary#accepted-string-input
const useMessage = gradient(['cyan', 'blue']).multiline(`🚀 Start building the project：${process.env.npm_package_name}`);

// boxen style options
const boxenOptions: BoxenOptions = {
	padding: 0.5,
	borderColor: 'blue',
	borderStyle: 'round'
};

/**
 * 自定义构建信息输出插件
 */
async function viteBuildInfo(): Promise<PluginOption> {
	let config: { command: 'build' | 'serve' };
	let outputDir: string;
	let startTime: Dayjs;
	let endTime: Dayjs;
	return {
		name: 'vite-plugin:build-info',
		configResolved(resolvedConfig) {
			config = resolvedConfig;
			outputDir = resolvedConfig.build.outDir ?? 'dist';
		},
		buildStart() {
			console.log(boxen(useMessage, boxenOptions));
			if (config.command === 'build') {
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
							margin: { top: 1 }
						}
					)
				);
			}
		}
	};
}

export { viteBuildInfo };
