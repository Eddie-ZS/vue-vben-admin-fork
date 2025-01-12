import type { CAC } from 'cac';

/**
 * 生成 code-workspace 代码工作空间文件脚本
 */
async function defineCodeWorkspaceCommand(cac: CAC) {
	cac
		.command('code-workspace')
		.usage('Update the `.code-workspace` file')
		.option('--spaces [number]', '.code-workspace JSON file spaces.', {
			default: 2
		})
		.option('--auto-commit', 'auto commit .code-workspace JSON file.', {
			default: false
		})
		.action(() => {});
}

export { defineCodeWorkspaceCommand };
