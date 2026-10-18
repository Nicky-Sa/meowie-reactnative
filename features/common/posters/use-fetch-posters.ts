import { useMemo } from "react";
import { PosterResDto } from "@/features/common/posters/poster.dto";
import { searchParamsToQuery } from "@/lib/utils/query";
import {
  PaginatedConfig,
  useQueryPaginatedConfigured,
  useRefreshQuery,
} from "@/features/common/data/query/hooks";
import { ID, SearchParams } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { deduplicate } from "@/features/common/data/utils/deduplicate";

export type URL =
  | `/person/${string}/posters`
  | `/${MediaType}/posters`
  | "/library/saved"
  | "/library/seen"
  | `/collections/${string}/items`
  | `/explore/${MediaType}/tabs/${string}`
  | `/${MediaType}/${ID}/recommendations/posters`;

// These lists start on a random page, so after the last page they go on from page 1
const ROTATING_PAGES_URL_PREFIXES = ["/explore/"];

export const useFetchPosters = (
  url: URL,
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
