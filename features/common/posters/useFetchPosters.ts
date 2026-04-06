import { useMemo } from "react";
import { PosterResDto } from "@/features/common/posters/poster.dto";
import { searchParamsToQuery } from "@/lib/functions";
import { useQueryPaginatedConfigured } from "@/features/common/data/query/hooks";
import { SearchParams } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { deduplicate } from "@/features/common/data/utils/deduplicate";

type URL =
  | `/person/${string}/posters`
  | `/${MediaType}/posters`
  | "/library/saved";

export const useFetchPosters = (
  url: URL,
  queryParams?: Partial<SearchParams>,
) => {
  const query = searchParamsToQuery(queryParams);

  const {
    data: response,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    size,
    ...rest
  } = useQueryPaginatedConfigured<PosterResDto>(
    [url, query],
    (pageParam: number) => `${url}?page=${pageParam + 1}&${query}`,
  );

  const data = useMemo(() => {
    const rawData = Array.isArray(response)
      ? response.map((page) => page.data.results)
      : [];

    return deduplicate(
      rawData.flat(),
      (item) => `${item.mediaType}-${item.id}`,
    );
  }, [response]);

  const dataLength = data.length;

  const totalPages = useMemo(() => {
    return Array.isArray(response) ? response[0]?.data.total_pages : 0;
  }, [response]);

  return {
    data,
    dataLength,
    totalPages,
    size,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    ...rest,
  };
};
