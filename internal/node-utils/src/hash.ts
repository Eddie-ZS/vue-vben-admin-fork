import { createHash } from 'node:crypto';

/**
 * 根据内容生成哈希
 * - 长度可自定义
 * @param content 内容
 * @param size 长度
 */
function generateContentHash(content: string, size?: number): string {
	const hash = createHash('md5').update(content).digest('hex');
	if (size) return hash.slice(0, size);
	return hash;
}

export { generateContentHash };
