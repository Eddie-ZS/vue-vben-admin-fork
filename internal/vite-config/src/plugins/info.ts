import type { PluginOption } from 'vite';
import { gradient, boxen, type BoxenOptions } from '@vbird/node-utils';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const useMessage = gradient(['cyan', 'blue']).multiline(
	'欢迎使用 gradient-string 控制台颜色渐变搭配 boxen 实现输出\n具体用法: https://reports.org.cn/plugin-using/gradient-string/summary#accepted-string-input'
);

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
	return {
		name: 'vite-plugin:build-info',
		buildStart() {
			console.log(boxen(useMessage, boxenOptions));
		},
		buildEnd() {
			console.log(boxen(gradient(['cyan', 'blue']).multiline('构建结束'), boxenOptions));
		}
	};
}

export { viteBuildInfo };
