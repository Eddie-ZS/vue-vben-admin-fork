import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	clean: true, // clean dist directory before build
	entries: ['./src/index.ts'], // entry file
	declaration: true // generate.d.ts file
	// outDir: "dist"  // Change outDir, default is 'dist'
});
