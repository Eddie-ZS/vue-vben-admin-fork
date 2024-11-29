import { defineConfig } from 'vite';

function defineApplicationConfig(userConfigPromise?: any) {
	return defineConfig(async (config) => {
		return config;
	});
}

export { defineApplicationConfig };
