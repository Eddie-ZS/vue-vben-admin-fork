import { dateUtil, readPackageJSON } from '@vbird/node-utils';
import type { PluginOption } from 'vite';
import type { OutputBundle, OutputChunk } from 'rollup';
import { EOL } from 'node:os';

/**
 * @description 注入版权信息插件
 */
async function viteLicensePlugin(root = process.cwd()): Promise<PluginOption | undefined> {
	const { description = '', homepage = '', version = '' } = await readPackageJSON(root);

	// 生成环境下打包生成包时，等其余插件执行完毕后再注入版权信息
	return {
		apply: 'build',
		enforce: 'post',
		generateBundle: {
			handler(_, bundle: OutputBundle) {
				console.log('Injecting license information...', bundle);
				// 获取当前时间
				const date = dateUtil().format('YYYY-MM-DD HH:mm:ss');
				// 版权信息
				const copyrightText = `/*!
          * Vbird Admin
          * Version: ${version}
          * Author: Eddie
          * Copyright (C) 2024 Eddie
          * License: MIT License
          * Description: ${description}
          * Date Created: ${date}
          * Homepage: ${homepage}
          * Contact: xxxxxxxxxxx@163.com
          `.trim();

				// 遍历打包生成文件的对象信息
				for (const [, fileContent] of Object.entries(bundle)) {
					if (fileContent.type === 'chunk' && fileContent.isEntry) {
						const chunkContent = fileContent as OutputChunk;
						// 获取原本的chunk内容
						const content = chunkContent.code;
						// 合并版权信息和原本内容
						const updatedContent = `${copyrightText}${EOL}${content}`;
						// 注入版权信息到每个入口文件
						(fileContent as OutputChunk).code = updatedContent;
					}
				}
			},
			order: 'post'
		},
		name: 'vite-plugin:license'
	};
}

export { viteLicensePlugin };
