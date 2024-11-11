export type Awaitable<T> = Promise<T> | T;

/**
 * @param im 动态导入的模块
 * @returns
 */
export async function inferOpDefault<T>(
  im: Awaitable<T>, // 动态导入的模块
): Promise<T extends { default: infer U } ? U : T> { // 类型断言
  const resolved = await im; // 等待模块加载完成
  return (resolved as any).default || resolved; // 返回模块的默认导出
}
