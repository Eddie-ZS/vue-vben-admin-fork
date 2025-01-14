import { colors, consola } from '@vbird/node-utils';

import { cac } from 'cac';

import { run } from './run';

try {
	const turboRun = cac('turbo-run');
	// 实现用户交互式启动脚本
	turboRun
		.command('[script]')
		.usage('Run turbo interactively')
		.action(async (command: string) => {
			await run({ command });
		});

	turboRun.on('command:*', () => {
		consola.error(colors.red('Invalid command'));
		process.exit(1);
	});

	turboRun.usage('turbo-run <script>');
	turboRun.help();
	turboRun.parse();
} catch (error) {
	consola.error(error);
	process.exit(1);
}
