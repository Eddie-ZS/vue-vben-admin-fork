import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	clean: true, // clean dist directory before build
	entries: ['src/index'], // entry file
	declaration: true // generate.d.ts file
});
