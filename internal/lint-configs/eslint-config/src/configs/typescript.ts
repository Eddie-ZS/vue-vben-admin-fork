import { inferOpDefault } from "../util";

export async function typescript() {
  const [tsEslint] = await Promise.all([
    inferOpDefault(import("typescript-eslint")),
  ] as const);

  return tsEslint.config(
    //
    ...tsEslint.configs.recommended,
    {
      files: ["**/*.?([cm])[jt]s?(x)"],
      rules: {},
    }
  );
}
