import { useCallback } from "react";

type Args = {
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  isLoading: boolean;
};

export const useFetchMore = ({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  isLoading,
}: Args) => {
  const onEndReached = useCallback(async () => {
    if (!isLoading && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  return { onEndReached };
};
