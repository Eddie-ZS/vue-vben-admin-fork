import type { PluginOption } from 'vite';
import { loadEnv } from '../utils/env';
import { colors, generateContentHash, readPackageJSON } from '@vbird/node-utils';

const VBIRD_ADMIN_APP_CONFIG = '_VBIRD_ADMIN_APP_CONF_';
const GLOBAL_CONFIG_FILE_NAME = '_app.config.js';

/**
 *  @description 确保路径末尾有斜杠
 */
function ensureTrailingSlash(path: string) {
	return path.endsWith('/') ? path : `${path}/`;
}

/**
 * @description 获取配置文件资源
 */
async function getConfigSource() {
	// 获取系统环境变量
	const config = await loadEnv();

	// 定义全局变量, 并将配置对象注入到全局变量中
	const windowVariables = `window.${VBIRD_ADMIN_APP_CONFIG}`;
	let source = `${windowVariables}=${JSON.stringify(config)}`;

	// 防止被修改， 进行以下操作
	source += `
  Object.freeze(${windowVariables});
  Object.defineProperty(window, '${VBIRD_ADMIN_APP_CONFIG}', {
    configurable: false,
    writable: false,
  });
  `.replaceAll(/\s/g, '');
	return source;
}

/**
 * 配置文件抽离插件
 * @description 构建项目时抽离应用配置文件到指定文件中
 */
async function viteExtraAppConfigPlugin(root: string = process.cwd()): Promise<PluginOption | undefined> {
	let publicPath: string;
	let source: string;
	const { version = '' } = await readPackageJSON(root);

	return {
		name: 'vite-plugin:extra-app-config',
		apply: 'build',
		async configResolved(resolvedConfig) {
			publicPath = ensureTrailingSlash(resolvedConfig.base);
			source = await getConfigSource();
		},
		// 在 bundle.generate() 结束后或在 bundle.write() 写入文件之前调用该插件
		async generateBundle() {
			try {
				// 通过插件的上下文函数触发文件。(在插件运行时，会给插件的上下文绑定一些工具函数，这些工具函数，可以通过this访问到)
				// 在构建输出中，发出一个新文件，然后返回这个文件的引用id，这个引用id可以在各个地方用来获取到发出的这个新文件。
				this.emitFile({
					// 提供了fileName，则直接当作生成的文件名
					// 如果提供了name，name会当作output.chunkFileNames 或者 output.assetFileNames 配置中的[name]参数，后面可能会加唯一的数字。如果都没提供，就用默认的。
					fileName: GLOBAL_CONFIG_FILE_NAME,
					source,
					// 如果是'chunk'，则根据id参数，来生成一个chunk。如果是'asset'，则生成的新文件中，使用'source'作为文件内容
					type: 'asset'
				});
				console.log(colors.cyan(`✨configuration file is build successfully!`));
			} catch (error) {
				console.log(colors.red(`configuration file failed to package:\n${error}`));
			}
		},
		async transformIndexHtml(html) {
			// 生成一个hash值，作为文件名后缀，防止浏览器缓存
			const hash = `v=${version}-${generateContentHash(source, 8)}`;
			// 生成绝对路径，指向配置文件的路径，并添加hash值作为参数
			const appConfigSrc = `${publicPath}${GLOBAL_CONFIG_FILE_NAME}?${hash}`;
			// @see https://cn.vitejs.dev/guide/api-plugin#transformindexhtml
			return {
				html,
				tags: [{ attrs: { src: appConfigSrc }, tag: 'script' }]
			};
		}
	};
}

export { viteExtraAppConfigPlugin };
