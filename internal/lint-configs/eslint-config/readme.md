### unbuild 插件

强大的基于 rollup 的捆绑器，支持 TypeScript 并生成 commonjs 和模块格式 + 类型声明。

### 用法

创建 src/index.ts：

```ts
export const log = (...args) => {
	console.log(...args);
};
```

更新package.json：

```json

  "type": "module",
  "scripts": {
    "stub": "unbuild",
  },
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "main": "./dist/index.cjs",
  "types": "./dist/index.d.ts",
  "files": ["dist"]
}
```

使用 unbuild 进行构建：

```bash
unbuild
```

配置是从映射到 src/ 目录的 package.json 字段中自动推断出来的。
构建完成后，dist/ 目录下会生成 index.mjs 和 index.d.ts 文件。

### 配置

创建 build.config.ts：

```ts
import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	clean: true, // 构建之前会先清空 dist 目录
	// 如果没有提供条目，将自动从package.json中推断出来
	entries: ['./src/index.ts'], // 入口文件
	declaration: true // 生成类型声明文件
	// outDir: "dist"  // 输出目录，默认是 dist
	// rollup: {
	// emitCJS: true, // 生成 commonjs 格式文件
	// },
});
```

### 命令行选项

1. stub

开发时可以使用 jiti 的插桩，此时运行

```bash
unbuild --stub
```

这时 `dist` 目录下生成的是带 `jiti` 的 `bundle` ，可以尝试 `node` 直接执行 这个 `bundle` 查看输出，然后更改 `src` 源代码，再次使用 `node` 直接执行这个 `bundle` ，你会发现输出的代码是更改过后的。

也就是说我们只需执行一次插桩命令，无需监听源文件的修改就能做到实时更新打包内容，这极大的节省了监听编译源代码所消耗的时间。

2. minify

3. sourcemap

4. watch
