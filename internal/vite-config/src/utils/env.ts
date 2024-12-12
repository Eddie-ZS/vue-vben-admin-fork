import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { fs } from '@vbird/node-utils';
import dotenv from 'dotenv';
import type { ApplicationPluginOptions } from '../types';

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
): Promise<
	{
		appTitle: string;
		base: string;
		port: number;
	} & Partial<ApplicationPluginOptions>
> {
	const envConfig = await loadEnv(match, confFiles);
	const {
		VITE_APP_TITLE,
		VITE_ARCHIVER,
		VITE_BASE,
		VITE_COMPRESS,
		VITE_DEVTOOLS,
		VITE_INJECT_APP_LOADING,
		VITE_NITRO_MOCK,
		VITE_PORT,
		VITE_PWA,
		VITE_VISUALIZER
	} = envConfig;

	const compressTypes = (VITE_COMPRESS ?? '').split(',').filter((item) => item === 'gzip' || item === 'brotli');
	return {
		appTitle: getString(VITE_APP_TITLE, 'Vbird Admin'),
		base: getString(VITE_BASE, '/'),
		port: getNumber(VITE_PORT, 3000),
		compress: compressTypes.length > 0,
		compressTypes,
		archiver: getBoolean(VITE_ARCHIVER),
		devtools: getBoolean(VITE_DEVTOOLS),
		injectAppLoading: getBoolean(VITE_INJECT_APP_LOADING),
		nitroMock: getBoolean(VITE_NITRO_MOCK),
		pwa: getBoolean(VITE_PWA),
		visualizer: getBoolean(VITE_VISUALIZER)
	};
}
export { getConfFiles, loadEnv, loadAndConvertEnv };
