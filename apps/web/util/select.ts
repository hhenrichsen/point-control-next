const emptySet: ReadonlySet<never> = new Set();

export function makeSelect<T>(
  fields: readonly string[],
  allowed: ReadonlySet<keyof T>,
  options: {
    required?: ReadonlySet<keyof T>;
    excluded?: ReadonlySet<keyof T>;
  } = {},
): Partial<Record<keyof T, boolean>> | undefined {
  const { required, excluded } = {
    required: emptySet,
    excluded: emptySet,
    ...options,
  };

  const requestedFields = fields.reduce<Partial<Record<keyof T, boolean>>>(
    (acc, curr) => {
      // as keyof T is allowed because if curr is not a key of T, it will
      // definitely not be in the set.
      if (allowed.has(curr as keyof T)) {
        acc[curr] = true;
      }
      return acc;
    },
    {},
  );

  const requiredFields = [...required.keys()].reduce((acc, curr) => {
    acc[curr] = true;
    return acc;
  }, requestedFields);

  const selectFields = [...excluded.keys()].reduce((acc, curr) => {
    acc[curr] = false;
    return acc;
  }, requiredFields);

  return Object.keys(selectFields).length > 0 ? selectFields : undefined;
}
