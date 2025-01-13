import { colors, consola } from '@vbird/node-utils';

import cac from 'cac';

import { defineCheckCircularCommand } from './check-circular';
import { defineDepcheckCommand } from './check-dep';
import { defineCodeWorkSpaceCommand } from './code-workspace';
import { defineLintCommand } from './lint';

try {
	// 创建 CLI 实例，可以选择指定将用于在帮助和版本消息中显示的程序名称。如果未设置，我们使用 argv[1] 的 basename
	const vsh = cac('vsh');

	/** 注册命令 */

	// vsh check-circular
	defineCheckCircularCommand(vsh);

	// vsh check-dep
	defineDepcheckCommand(vsh);

	// vsh code-workspace
	defineCodeWorkSpaceCommand(vsh);

	// vsh lint
	defineLintCommand(vsh);

	// 事件: 监听命令
	vsh.on('command:*', () => {
		consola.error(colors.red('Invalid command'));
		process.exit(1);
	});

	vsh.usage('vsh');
	vsh.help();
	vsh.parse();
} catch (error) {
	consola.error(error);
	process.exit(1);
}
