/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {}

/**
 * 根据指定前缀获取环境变量
 */
async function loadEnv<T = Record<string, string>>(match = 'VITE_GLOB_', confFiles = getConfFiles()) {
	return {} as T;
}
