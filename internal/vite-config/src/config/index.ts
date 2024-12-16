import type { DefineConfig } from '../types';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { defineApplicationConfig } from './application';
import { defineLibraryConfig } from './library';

function defineConfig(useConfigPromise?: DefineConfig, type: 'application' | 'auto' | 'library' = 'auto') {
	let projectType = type;
	//  若类型为 auto, 判断根目录下是否存在 index.html, 若存在则为 application, 否则为 library
	if (projectType === 'auto') {
		const indexPath = join(process.cwd(), 'index.html');
		projectType = execSync(indexPath) ? 'application' : 'library';
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
