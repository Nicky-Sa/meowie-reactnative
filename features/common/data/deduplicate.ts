/**
 * Removes duplicate items from a list based on a key derived from each item.
 * Preserves the first occurrence of each duplicate.
 */
export const deduplicate = <T>(
  items: T[],
  getKey: (item: T) => string,
): T[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
