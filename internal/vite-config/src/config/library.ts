import { defineConfig } from 'vite';

function defineLibraryConfig(userConfigPromise?: any) {
	return defineConfig(async (config) => {
		return config;
	});
}

export { defineLibraryConfig };
