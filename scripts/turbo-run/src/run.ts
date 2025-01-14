import { getPackagesAsync } from '@vbird/node-utils';

import { select } from '@clack/prompts';

interface RunOptions {
	command?: string;
}

/**
 * 实现用户交互式启动脚本
 */
export async function run({ command }: RunOptions) {
	if (!command) {
		console.error('Please specify the command to run!');
		process.exit(1);
	}
	// 获取所有包中的 package.json 文件，过滤出有 command 命令的包，然后执行相应的命令
	const { packages } = await getPackagesAsync();
	const packagesWithCommand = packages.filter((pkg) => (pkg.packageJson as Record<string, any>)?.scripts?.[command]);

	let isSelectPkg: string | symbol;
	if (packagesWithCommand.length > 1) {
		// 单选需要运行的包
		isSelectPkg = await select({
			message: `Please select the application you want to run [${command}]:`,
			options: packagesWithCommand.map((el) => ({
				label: el.packageJson.name,
				value: el.packageJson.name
			}))
		});
		// if (isCancel(isSelectPkg)) {}
	}
}
