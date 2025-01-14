import { consola, execaCommand, getPackagesAsync } from '@vbird/node-utils';

import { cancel, isCancel, select } from '@clack/prompts';

interface RunOptions {
	command?: string;
}

/**
 * 实现用户交互式启动脚本
 */
export async function run({ command }: RunOptions) {
	if (!command) {
		console.error('Please specify the command to run!');
		process.exit(0);
	}
	// 获取所有包中的 package.json 文件，过滤出有 command 命令的包
	const { packages } = await getPackagesAsync();
	const packagesWithCommand = packages.filter((pkg) => (pkg.packageJson as Record<string, any>)?.scripts?.[command]);

	let selectAppName: string | symbol;
	if (packagesWithCommand.length > 1) {
		// 单选需要运行的包
		selectAppName = await select({
			message: `Please select the application you want to run [${command}]:`,
			// select 组件允许用户从选项列表中选择一个值。结果是给定选项的 value 属性
			options: packagesWithCommand.map((el) => ({
				label: el.packageJson.name,
				value: el.packageJson.name
			}))
		});
		// 按 ctrl+c 正常退出
		if (isCancel(selectAppName) || !selectAppName) {
			cancel('Process exit!');
			process.exit(0);
		}
	} else {
		selectAppName = packagesWithCommand[0]?.packageJson.name ?? '';
	}
	// 若不存在可运行的包，则提示用户
	if (!selectAppName) {
		consola.info('No Found Application!');
		process.exit(0);
	}

	// 执行命令
	execaCommand(`pnpm -F ${selectAppName} run ${command}`, {
		stdio: 'inherit'
	});
}
