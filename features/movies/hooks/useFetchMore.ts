import { useCallback } from "react";

type Args = {
  size: number;
  setSize: (size: number) => void;
  isLoading: boolean;
  isValidating: boolean;
  totalPages: number;
};

export const useFetchMore = ({
  size,
  setSize,
  isLoading,
  isValidating,
  totalPages,
}: Args) => {
  const onEndReached = useCallback(async () => {
    if (!(isLoading || isValidating) && size < totalPages) {
      setSize(size + 1);
    }
  }, [isLoading, isValidating, size, totalPages, setSize]);

  return { onEndReached };
};
