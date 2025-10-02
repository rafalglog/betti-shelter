/**
 * A utility that flattens a complex object type into a more readable form.
 *
 * This is primarily a developer experience tool. It takes types that might be
 * complex intersections (`&`), or use `Omit` or `Pick`, and resolves them
 * into a simple, flat object shape. This makes the type easier to read in
 * IDE tooltips.
 *
 * @example
 * // Without Prettify, a tooltip might show: Omit<{a: 1, b: 2}, 'b'> & {c: 3}
 * type MyType = Prettify<Omit<{a: 1, b: 2}, 'b'> & {c: 3}>;
 * // With Prettify, the tooltip will show: {a: 1, c: 3}
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};