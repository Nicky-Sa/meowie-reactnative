import { useCallback } from "react";
import { useAtom } from "jotai";
import { atomPersistedWithImmer } from "@/atoms/storage";
import { PERSISTED_ATOM_KEYS } from "@/features/common/data/utils/storage-keys";
import { MultiSearchResults } from "@/features/search/data/models/search-result";

const MAX_RECENT_SEARCHES = 7;

const recentSearchesAtom = atomPersistedWithImmer<MultiSearchResults[]>(
  PERSISTED_ATOM_KEYS.RECENT_SEARCHES,
  [],
);

const isSameItem = (a: MultiSearchResults, b: MultiSearchResults) =>
  a.id === b.id && a.mediaType === b.mediaType;

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useAtom(recentSearchesAtom);

  const add = useCallback(
    (item: MultiSearchResults) =>
      setRecentSearches((draft) => {
        const index = draft.findIndex((r) => isSameItem(r, item));
        if (index !== -1) draft.splice(index, 1); // move existing to the top
        draft.unshift(item);
        if (draft.length > MAX_RECENT_SEARCHES) {
          draft.splice(MAX_RECENT_SEARCHES);
        }
      }),
    [setRecentSearches],
  );

  const remove = useCallback(
    (item: MultiSearchResults) =>
      setRecentSearches((draft) => {
        const index = draft.findIndex((r) => isSameItem(r, item));
        if (index !== -1) draft.splice(index, 1);
      }),
    [setRecentSearches],
  );

  return { recentSearches, add, remove };
};
