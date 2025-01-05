import { defineConfig } from '@vbird/vite-config';

export default defineConfig(async () => {
	return {
		vite: {
			publicDir: 'src/scss-bem'
		}
	};
});
