import { inferOpDefault } from "../util";

export async function typescript() {
  const [tsEslint] = await Promise.all([
    inferOpDefault(import("typescript-eslint")),
  ] as const);

  return tsEslint.config(
    // ts-eslint 规则集
    ...tsEslint.configs.recommended,
    {
      files: ["**/*.?([cm])[jt]s?(x)"],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off', // 允许 any 类型
        '@typescript-eslint/no-use-before-define': 'off', // 允许在定义前使用变量
        'unused-imports/no-unused-vars': 'off', // 关闭 unused-imports/no-unused-vars 规则
      },
    }
  );
}
