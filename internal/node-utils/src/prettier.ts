import { promises as fs } from 'node:fs';

// @see https://prettier.nodejs.cn/docs/en/api.html#prettierresolveconfigfileurlorpath--options
import { format, getFileInfo, resolveConfig } from 'prettier';

/**
 * 编程方式运行 Prettier
 * TODO 待完善下列字段的含义
 * @param filePath
 */
async function prettierFormat(filePath: string) {
	const options = await resolveConfig(filePath, {});
	const fileInfo = await getFileInfo(filePath);
	// 输入内容
	const input = await fs.readFile(filePath, 'utf8');
	// 格式化后内容
	const output = await format(input, {
		...options,
		parser: fileInfo.inferredParser as any
	});

	if (output !== input) {
		await fs.writeFile(filePath, output, 'utf8');
	}
	return output;
}

export { prettierFormat };
