export const R = {
  toArray: <K extends string, T>(record: Record<K, T>) =>
    Object.keys(record)
      .sort()
      .map((k) => [k, (record as any)[k]]),
};
