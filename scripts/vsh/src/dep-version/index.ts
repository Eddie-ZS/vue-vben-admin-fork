import type { CAC } from 'cac';

import { consola, execaCommand, ExecaError } from '@vbird/node-utils';

interface DepVersionOptions {
	check: boolean | string;
	update: boolean | string;
}

async function runDepVersion(options: DepVersionOptions) {
	const { check, update } = options;
	try {
		await execaCommand('pnpm outdated --format json', { stdio: 'inherit' });
	} catch (error) {
		if (error instanceof ExecaError) {
			consola.error(error);
		}
	}
}

function defineDepVersionCommand(cac: CAC) {
	cac
		.command('dep-version')
		.usage('Check the version of dependencies and update the version')
		.option('--check <name>', 'Check the version of dependencies')
		.option('--update <name>', 'Update the version of dependencies')
		.action(async (options: DepVersionOptions) => {
			await runDepVersion(options);
		});
}

export { defineDepVersionCommand };
