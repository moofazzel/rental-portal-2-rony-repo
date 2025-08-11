// types/page.types.ts
export type PageParams<T extends string> = {
  params: Record<T, string>;
};
