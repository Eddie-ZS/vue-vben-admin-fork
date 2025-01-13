import type { Linter } from 'eslint';

export async function ignores(): Promise<Linter.Config[]> {
	return [
		{
			ignores: [
				'**/node_modules',
				'**/dist',
				'**/dist-*',
				'**/.husky',
				'**/.git',
				'**/.github',
				'**/.vscode',
				'**/.turbo',
				'**/temp',
				'**/.temp',
				'**/tmp',
				'**/.tmp',
				'**/.history',
				'**/.changeset',
				'**/.idea',
				'**/Dockerfile',
				'**/package-lock.json',
				'**/yarn.lock',
				'**/pnpm-lock.yaml',
				'**/.vite-inspect',

				'**/CHANGELOG*.md',
				'**/*.min.*',
				'**/LICENSE*',
				'**/__snapshots__',
				'**/*.snap',
				'**/fixtures/**',
				'**/.vitepress/cache/**',
				'**/auto-import?(s).d.ts',
				'**/components.d.ts',
				'**/vite.config.mts.*',
				'**/*.sh',
				'**/*.ttf',
				'**/*.woff'
			]
		}
	];
}
