import { defineConfig } from 'vite';
import type { DefineApplicationOptions } from '../types';

function defineApplicationConfig(userConfigPromise?: DefineApplicationOptions) {
	return defineConfig(async (config) => {
		return config;
	});
}

export { defineApplicationConfig };
