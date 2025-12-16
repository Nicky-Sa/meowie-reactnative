import { useCallback } from "react";

type Args = {
  size: number;
  setSize: (size: number) => void;
  isLoading: boolean;
  totalPages: number;
};

export const useFetchMore = ({
  size,
  setSize,
  isLoading,
  totalPages,
}: Args) => {
  const onEndReached = useCallback(async () => {
    if (!isLoading && size < totalPages) {
      setSize(size + 1);
    }
  }, [isLoading, size, totalPages, setSize]);

  return { onEndReached };
};
