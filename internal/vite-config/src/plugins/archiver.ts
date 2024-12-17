import type { PluginOption } from 'vite';
import type { ArchiverPluginOptions } from '../types';

import { join } from 'node:path';
import fsp from 'node:fs/promises';
import fs from 'node:fs';
import archiver from 'archiver';

/**
 * @description 通过流式处理的方式压缩打包后的文件
 */
function viteArchiverPlugin(options: ArchiverPluginOptions = {}): PluginOption {
	return {
		apply: 'build',
		name: 'vite-plugin:archiver',
		// 在服务器关闭时被调用
		closeBundle: {
			async handler() {
				const { name = 'dist', outputDir = '.' } = options;
				// 文件夹目录名
				const folderToZip = 'dist';
				// 获取输出目录
				const zipOutputDir = join(process.cwd(), outputDir);
				// 获取输出路径
				const zipOutputPath = join(zipOutputDir, `${name}.zip`);
				try {
					// 创建目录
					await fsp.mkdir(zipOutputDir, { recursive: true });
				} catch {}

				try {
					// 压缩
					await zipFolder(folderToZip, zipOutputPath);
					console.log(`Folder has been zipped to: ${zipOutputPath}`);
				} catch (error) {
					console.error('Error zipping folder:', error);
				}
			},
			order: 'post'
		},
		enforce: 'post'
	};
}

/**
 * TODO: 待确定folderToZip是否是目录名（里面存储的是压缩后的 dist 文件）
 * @description 实现压缩文件夹功能
 * @param folderToZip 文件夹目录名
 * @param zipOutputPath 输出路径
 */
async function zipFolder(folderToZip: string, zipOutputPath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		// 创建输出流
		const output = fs.createWriteStream(zipOutputPath);
		const archive = archiver('zip', {
			zlib: { level: 9 } // 设置压缩级别
		});
		// 关闭回调
		output.on('close', () => {
			console.log(`ZIP file created: ${zipOutputPath} (${archive.pointer()} total bytes)`);
			resolve();
		});

		// 错误回调
		archive.on('error', (err) => {
			reject(err);
		});

		// 将数据输送到文件中
		archive.pipe(output);

		// 使用 directory 方法以流的方式压缩文件夹，减少内存消耗
		archive.directory(folderToZip, false);

		// 流式处理完成
		// ‘close‘, ‘end’ 或 ’finish’ 可能在调用此方法后立即触发，因此请事先注册它们
		archive.finalize();
	});
}

export { viteArchiverPlugin };
