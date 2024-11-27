import { promises as fs } from 'node:fs';
import { dirname } from 'node:path';

/**
 * @param filePath 文件路径
 * @param data 数据
 * @param ident 缩进
 */
async function outputJson(filePath: string, data: any, ident: number = 2) {
	try {
		// 1. 获取路径的目录名
		const dir = dirname(filePath);
		// 2. 创建文件夹
		await fs.mkdir(dir, { recursive: true });
		// 3. 把数据源转为JSON字符串
		const JsonData = JSON.stringify(data, null, ident);
		// 4. 把字符串写入到所建文件中
		await fs.writeFile(filePath, JsonData, 'utf-8');
	} catch (error) {
		console.error('Error writing JSON File:', error);
		throw error;
	}
}

/**
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

export { outputJson, ensureFile, readJSON };
