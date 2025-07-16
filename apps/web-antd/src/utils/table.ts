/**
 * 返回id和对应的文本
 * @param id 匹配的键
 * @param arr 待匹配数组
 * @param opt 个性配置
 * @returns (id) <对应的文本>
 */
export function codeAndName(
  id: number,
  arr: Record<string, any>[],
  opt: { name: string; id: string } = { name: 'name', id: 'id' },
) {
  const name = arr.find((item) => item[opt.id] === id)?.[opt.name] ?? '';
  return `(${id}) ${name}`;
}
