import { posix } from 'path';

/**
 * 将给定的文件路径转换为 POSIX 风格。
 * @param path 原始文件路径
 */
function toPosixPath(path: string): string {
	return path.split('\\').join(posix.sep);
}

export { toPosixPath };
