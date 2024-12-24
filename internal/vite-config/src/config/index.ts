import type { DefineConfig } from '../types';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { defineApplicationConfig } from './application';
import { defineLibraryConfig } from './library';

/**
 * @description: 生成 vite 配置
 * @param {DefineConfig} useConfigPromise 用户自定义配置函数
 * @param {'application' | 'auto' | 'library'} type 项目类型
 */
function defineConfig(useConfigPromise?: DefineConfig, type: 'application' | 'auto' | 'library' = 'auto') {
	let projectType = type;
	//  若类型为 auto, 判断根目录下是否存在 index.html, 若存在则为 application（应用）, 否则为 library（库）
	if (projectType === 'auto') {
		const indexPath = join(process.cwd(), 'index.html');
		projectType = existsSync(indexPath) ? 'application' : 'library';
	}

	switch (projectType) {
		case 'application':
			return defineApplicationConfig(useConfigPromise);
		case 'library':
			return defineLibraryConfig(useConfigPromise);
		default: {
			throw new Error(`Invalid project type: ${projectType}`);
		}
	}
}

export { defineConfig };
