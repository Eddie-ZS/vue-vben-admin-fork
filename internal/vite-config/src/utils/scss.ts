import type { CSSOptions } from 'vite';

import { relative } from 'node:path';

import { consola, findMonorepoRoot } from '@vbird/node-utils';

/**
 * @param injectGlobalScss 是否注入全局scss
 */
function createCssOptions(injectGlobalScss: boolean): CSSOptions {
	console.log(111, injectGlobalScss);

	const root = findMonorepoRoot();
	return {
		preprocessorOptions: injectGlobalScss
			? {
					scss: {
						additionalData: (source, filename) => {
							const relativePath = relative(root, filename);
							consola.log('source: ', source);
							consola.log('filename: ', filename);
							consola.log('relativePath: ', relativePath);
							return source;
						}
					}
				}
			: {}
	};
}

export { createCssOptions };
