import { defineConfig } from 'vite';
import type { DefineLibraryOptions } from '../types';

function defineLibraryConfig(userConfigPromise?: DefineLibraryOptions) {
	return defineConfig(async (config) => {
		return config;
	});
}

export { defineLibraryConfig };
