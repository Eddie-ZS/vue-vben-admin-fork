import type { PluginOption } from 'vite';

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readPackageJSON } from '@vbird/node-utils';

/**
 * @description 用于在app内显示loading动画，并根据用户的主题切换loading的颜色
 * @param isBuild 是否是生产环境
 * @param env
 * @param loadingTemplate loading html模板路径
 */
async function viteInjectAppLoadingPlugin(
	isBuild: boolean,
	env: Record<string, any> = {},
	loadingTemplate: string = 'loading.html'
): Promise<PluginOption | undefined> {
	// 获取loading的html模板内容
	const loadingContent = await getLoadingRawByHtmlTemplate(loadingTemplate);
	// 读取package.json中的版本号
	const { version } = await readPackageJSON(process.cwd());
	const envRaw = isBuild ? 'prod' : 'dev';
	const cacheName = `${env.VITE_APP_NAMESPACE}-${version}-${envRaw}-preferences-theme`;

	// 获取缓存主题
	// 保证暗黑主题下，刷新页面时，loading主题也是暗黑的
	const injectScript = `
  <script data-app-loading="inject-js">
    var theme = localStorage.getItem(${cacheName});
    document.documentElement.classList.toggle('dark', /dark/.test(theme));
  </script>
  `;

	if (!loadingContent) return;

	return {
		// 指定插件顺序
		enforce: 'pre',
		name: 'vite-plugin:inject-app-loading',
		// @see https://cn.vitejs.dev/guide/api-plugin#transformindexhtml
		transformIndexHtml: {
			handler(html) {
				const reg = /<body\s*>/;
				html = html.replace(reg, `<body>${injectScript}${loadingContent}`);
				return html;
			},
			order: 'pre'
		}
	};
}

/**
 * 用于获取loading的html模板
 * @description 支持在app内自定义loading模板，模版参考default-loading.html即可
 */
async function getLoadingRawByHtmlTemplate(loadingTemplate: string) {
	// 获取loading的html模板路径
	let appLoadingPath = join(process.cwd(), loadingTemplate);
	// 若不存在自定义模板，则使用默认模板
	if (!fs.existsSync(appLoadingPath)) {
		const __dirname = fileURLToPath(new URL('.', import.meta.url));
		appLoadingPath = join(__dirname, './default-loading.html');
	}
	// 获取loading的html模板内容
	return await fsp.readFile(appLoadingPath, 'utf-8');
}

export { viteInjectAppLoadingPlugin };
