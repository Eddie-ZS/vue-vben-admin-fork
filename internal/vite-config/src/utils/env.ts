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
	return {} as T;
}

export { getConfFiles, loadEnv };
