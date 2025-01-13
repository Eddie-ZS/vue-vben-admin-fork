import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	clean: true, // clean dist directory before build
	declaration: true, // generate.d.ts file
	entries: ['./src/index.ts'] // entry file
});
