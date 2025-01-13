import type { UserConfig } from 'vite';

export const defineCommonConfig = async (): Promise<UserConfig> => {
	return {
		build: {
			//小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项
			assetsInlineLimit: 4096,
			chunkSizeWarningLimit: 1000,
			minify: true,
			sourcemap: false
		}
	};
};
