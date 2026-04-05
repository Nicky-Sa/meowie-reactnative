import { PosterResDto } from "@/features/common/posters/poster.dto";
import { searchParamsToQuery } from "@/lib/functions";
import { useQueryPaginatedConfigured } from "@/features/common/data/query/hooks";
import { SearchParams } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { deduplicate } from "@/features/common/data/deduplicate";

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

  const rawData = Array.isArray(response)
    ? response.map((page) => page.data.results)
    : [];

  const flattenedData = deduplicate(
    rawData.flat(),
    (item) => `${item.mediaType}-${item.id}`,
  );

  const totalPages = Array.isArray(response)
    ? response[0]?.data.total_pages
    : 0;

  return {
    data: flattenedData,
    dataLength: flattenedData.length,
    totalPages,
    size,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    ...rest,
  };
};
