import useSWRInfinite from "swr/infinite";
import { useEffect, useMemo } from "react";
import { SuccessResponse } from "@/features/common/data/transformers";
import { fetcher } from "@/features/common/data/fetcher";
import { MoviePosterResDto } from "@/features/movies/deep-dive/data/poster/poster.dto";

// Input type is Array of Arrays (batches of IDs)
export const useFetchMoviesPoster = (idBatches: number[][]) => {
  const getKey = (pageIndex: number) => {
    // Get the specific batch of IDs directly
    const currentBatchIds = idBatches[pageIndex];

    // If this batch doesn't exist yet, stop
    if (!currentBatchIds || currentBatchIds.length === 0) return null;

    // Stable Key: dependent ONLY on this specific batch
    return `/movies/poster/bulk?ids=${currentBatchIds.join(",")}`;
  };

  const { data, size, setSize, ...rest } = useSWRInfinite<
    SuccessResponse<MoviePosterResDto>,
    Error
  >(getKey, fetcher, {
    parallel: true,
    revalidateFirstPage: false,
  });

  // Sync the number of poster pages with the number of ID batches.
  // As more IDs are fetched, the idBatches array grows
  useEffect(() => {
    if (idBatches.length > size) {
      setSize(idBatches.length);
    }
  }, [idBatches.length, size, setSize]);

  const flattenedData = useMemo(() => {
    return data ? data.flatMap((page) => page.data) : [];
  }, [data]);

  return {
    data: flattenedData,
    ...rest,
  };
};
