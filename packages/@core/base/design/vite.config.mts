import { defineConfig } from '@vbird/vite-config';

export default defineConfig(async () => {
	return {
		vite: {
			// 作为静态资源服务的文件夹。
			// 该目录中的文件在开发期间在 / 处提供，并在构建期间复制到 outDir 的根目录(默认dist)，并且始终按原样提供或复制而无需进行转换。
			publicDir: 'src/scss-bem'
		}
	};
});
