import { useMemo } from "react";
import { PosterResDto } from "@/features/common/posters/poster.dto";
import { searchParamsToQuery } from "@/lib/utils/query";
import { useQueryPaginatedConfigured } from "@/features/common/data/query/hooks";
import { ID, SearchParams } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { deduplicate } from "@/features/common/data/utils/deduplicate";

export type URL =
  | `/person/${string}/posters`
  | `/${MediaType}/posters`
  | "/library/saved"
  | "/library/seen"
  | `/collections/${string}/items`
  | `/${MediaType}/${ID}/recommendations/posters`;

export const useFetchPosters = (
  url: URL,
  searchParams?: Partial<SearchParams>,
) => {
  const query = searchParamsToQuery(searchParams);

  const {
    data: response,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    ...rest
  } = useQueryPaginatedConfigured<PosterResDto>(
    [url, query],
    (pageParam: number) => `${url}?page=${pageParam + 1}&${query}`,
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
    ...rest,
  };
};
