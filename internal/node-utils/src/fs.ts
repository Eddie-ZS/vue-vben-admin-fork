// @see https://nodejs.cn/api/fs.html
import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';

import { partial } from 'filesize';

/**
 * 异步地将数据写入文件，如果文件已经存在，则替换该文件。
 * - flags参数默认为 'w'
 * @param filePath 文件路径
 * @param data 数据
 * @param ident 缩进
 */
async function outputJson(filePath: string, data: any, ident: number = 2) {
	try {
		// 1. 获取路径的目录名
		const dir = dirname(filePath);
		// 2. 创建目录 （ { recursive: true } 指应创建父目录 ）
		await fs.mkdir(dir, { recursive: true });
		// 3. 把数据源转为JSON字符串
		const JsonData = JSON.stringify(data, null, ident);
		// 4. 把字符串写入到所建文件中
		await fs.writeFile(filePath, JsonData, 'utf8');
	} catch (error) {
		console.error('Error writing JSON File:', error);
		throw error;
	}
}

/**
 *  确保文件存在，如果文件不存在则创建文件
 *  - 'a'：打开文件进行追加。如果文件不存在，则创建该文件。
 * @param filePath 文件路径
 */
async function ensureFile(filePath: string) {
	try {
		const dir = dirname(filePath);
		await fs.mkdir(dir, { recursive: true });
		await fs.writeFile(filePath, '', { flag: 'a' });
	} catch (error) {
		console.error('Error ensuring file:', error);
		throw error;
	}
}

/**
 * 读取内存中文件的完整内容
 * - 意味着大文件将对您的内存消耗和程序执行速度产生重大影响
 * @param filePath 文件路径
 * @returns
 */
async function readJSON(filePath: string) {
	try {
		const data = await fs.readFile(filePath, 'utf8');
		return JSON.parse(data);
	} catch (error) {
		console.error('Error reading JSON file:', error);
		throw error;
	}
}

/**
 * 获取打包后的文件大小
 * - folder  打包输出目录
 * - format  是否格式化输出
 */
async function getPackageSize(options: { folder: string; format?: boolean }) {
	const { folder = 'dist', format = true } = options || {};
	const fileListTotal: number[] = [];
	const computationRecursively = async (folder: string) => {
		const files = await fs.readdir(folder);
		for (const file of files) {
			try {
				const stats = await fs.stat(join(folder, file));
				if (stats.isFile()) {
					fileListTotal.push(stats.size);
				} else if (stats.isDirectory()) {
					await computationRecursively(join(folder, file));
				}
			} catch {}
		}
	};
	await computationRecursively(folder);
	const size = fileListTotal.reduce((acc, cur) => acc + cur, 0);
	return format ? partial({ standard: 'jedec' })(size) : size;
}

export { ensureFile, getPackageSize, outputJson, readJSON };
