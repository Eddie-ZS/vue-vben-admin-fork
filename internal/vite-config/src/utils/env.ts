import { join } from 'node:path';
import { existsSync } from 'node:fs';

import { fs } from '@vbird/node-utils';

import dotenv from 'dotenv';

const getString = (value: string | undefined, defaultValue: string) => value ?? defaultValue;

const getBoolean = (value: string | undefined) => value === 'true';

const getNumber = (value: string | undefined, defaultValue: number) => Number(value) || defaultValue;

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
	const script = process.env.npm_lifecycle_script as string;
	const reg = /--mode ([\d_a-z]+)/;
	const result = reg.exec(script);
	let mode = 'production';
	if (result) {
		mode = result[1] as string;
	}
	return ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`];
}

/**
 * 根据指定前缀获取环境变量
 */
async function loadEnv<T = Record<string, string>>(match = 'VITE_GLOB_', confFiles = getConfFiles()) {
	let envConfig = {};
	for (const confFile in confFiles) {
		try {
			// 获取配置文件路径
			const confFilePath = join(process.cwd(), confFile);
			// 判断配置文件是否存在
			if (existsSync(confFilePath)) {
				// 读取配置文件内容
				const envPath = await fs.readFile(confFilePath, { encoding: 'utf-8' });
				// 解析配置文件内容
				const env = dotenv.parse(envPath);
				envConfig = { ...envConfig, ...env };
			}
		} catch (error) {
			console.error(`Error while parsing ${confFile}`, error);
		}
	}
	const reg = new RegExp(`^(${match})`);
	// 过滤出指定前缀的环境变量
	Object.keys(envConfig).forEach((key) => {
		// 匹配失败则删除
		if (!reg.test(key)) {
			Reflect.deleteProperty(envConfig, key);
		}
	});
	return envConfig as T;
}

/**
 * 读取环境变量并转换成对象
 */
async function loadAndConvertEnv(
	match = 'VITE_',
	confFiles = getConfFiles()
): Promise<{
	appTitle: string;
	base: string;
	port: number;
}> {
	return {
		appTitle: getString('', 'Vbird Admin'),
		base: getString('', '/'),
		port: getNumber('3000', 3000)
	};
}
export { getConfFiles, loadEnv, loadAndConvertEnv };
