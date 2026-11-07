import { useMemo } from "react";
import { PosterResDto } from "@/features/common/posters/poster.dto";
import { searchParamsToQuery } from "@/lib/utils/query";
import {
  PaginatedConfig,
  useQueryPaginatedConfigured,
  useRefreshQuery,
} from "@/features/common/data/query/hooks";
import { SearchParams } from "@/features/common/data/media-query";
import { PostersUrl } from "@/features/common/posters/types";
import { deduplicate } from "@/features/common/data/utils/deduplicate";

// These lists start on a random page, so after the last page they go on from page 1
const ROTATING_PAGES_URL_PREFIXES = ["/explore/"];

export const useFetchPosters = (
  url: PostersUrl,
  searchParams?: Partial<SearchParams>,
  config?: PaginatedConfig<PosterResDto, Error>,
) => {
  const query = searchParamsToQuery(searchParams);
  const queryKey = useMemo(() => [url, query], [url, query]);
  const { refresh: onRefresh, isRefreshing } = useRefreshQuery(queryKey);

  const {
    data: response,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    ...rest
  } = useQueryPaginatedConfigured<PosterResDto>(
    queryKey,
    (pageParam: number) => {
      // let the backend decide the content of the first page
      if (pageParam === 0) {
        return query ? `${url}?${query}` : url;
      }
      return `${url}?page=${pageParam}&${query}`;
    },
    {
      rotatePages: ROTATING_PAGES_URL_PREFIXES.some((prefix) =>
        url.startsWith(prefix),
      ),
      ...config,
    },
  );

  const data = useMemo(
    () =>
      deduplicate(
        (response ?? []).flatMap((page) => page.data.results),
        (item) => `${item.mediaType}-${item.id}`,
      ),
    [response],
  );

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onRefresh,
    isRefreshing,
    ...rest,
  };
};
