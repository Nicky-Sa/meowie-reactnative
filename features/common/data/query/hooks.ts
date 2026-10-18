import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from "@tanstack/react-query";
import { fetcher, MutationArg } from "@/features/common/data/fetcher";
import { SuccessResponse } from "@/features/common/data/transformers";
import { useCallback, useRef, useState } from "react";

type QueryConfig<Data, Err> = Omit<
  UseQueryOptions<SuccessResponse<Data>, Err>,
  "queryKey" | "queryFn"
>;

export const useQueryConfigured = <Data, Err = Error>(
  url: string,
  config?: QueryConfig<Data, Err>,
) =>
  useQuery<SuccessResponse<Data>, Err>({
    queryKey: [url],
    queryFn: () => fetcher<unknown, Data>(url),
    ...config,
  });

export type PaginatedConfig<Data, Err> = Omit<
  UseInfiniteQueryOptions<
    SuccessResponse<Data>,
    Err,
    InfiniteData<SuccessResponse<Data>>,
    readonly unknown[],
    number
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
> & {
  // After the last page, go on from page 1
  rotatePages?: boolean;
};

export const useQueryPaginatedConfigured = <
  Data extends { page: number; total_pages: number },
  Err = Error,
>(
  queryKey: unknown[],
  urlForPage: (pageParam: number) => string,
  config?: PaginatedConfig<Data, Err>,
) => {
  const { rotatePages = false, ...queryConfig } = config ?? {};

  const result = useInfiniteQuery<
    SuccessResponse<Data>,
    Err,
    InfiniteData<SuccessResponse<Data>>,
    readonly unknown[],
    number
  >({
    queryKey,
    queryFn: ({ pageParam, signal }) =>
      fetcher<unknown, Data>(urlForPage(pageParam), undefined, { signal }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const isLastPage = lastPage.data.page >= lastPage.data.total_pages;
      if (!rotatePages) return isLastPage ? undefined : lastPage.data.page + 1;

      const startPage = allPages[0].data.page;
      const nextPage = isLastPage ? 1 : lastPage.data.page + 1;
      return nextPage === startPage ? undefined : nextPage;
    },
    ...queryConfig,
  });

  return { ...result, data: result.data?.pages };
};

type InfiniteConfig<Data, Err> = Omit<
  UseInfiniteQueryOptions<
    SuccessResponse<Data>,
    Err,
    InfiniteData<SuccessResponse<Data>>,
    readonly unknown[],
    number
  >,
  "queryKey" | "initialPageParam"
>;

export const useQueryInfiniteConfigured = <Data, Err = Error>(
  queryKey: unknown[],
  url: string,
  config: InfiniteConfig<Data, Err>,
) => {
  const result = useInfiniteQuery<
    SuccessResponse<Data>,
    Err,
    InfiniteData<SuccessResponse<Data>>,
    readonly unknown[],
    number
  >({
    queryKey,
    queryFn: ({ signal }) => fetcher<unknown, Data>(url, undefined, { signal }),
    initialPageParam: 0,
    ...config,
  });

  return { ...result, data: result.data?.pages };
};

export const useMutationConfigured = <REQ, RES, Err = Error>(
  url: string,
  config?: UseMutationOptions<SuccessResponse<RES>, Err, MutationArg<REQ>>,
) => {
  const result = useMutation<SuccessResponse<RES>, Err, MutationArg<REQ>>({
    mutationKey: [url],
    mutationFn: (arg: MutationArg<REQ>) => fetcher<REQ, RES>(url, { arg }),
    ...config,
  });

  return {
    ...result,
    isMutating: result.isPending,
  };
};

/** Clears every cached query whose URL matches the pattern. */
export const useInvalidateByPattern = () => {
  const queryClient = useQueryClient();

  const invalidateByPattern = useCallback(
    async (pattern: RegExp): Promise<void> => {
      await queryClient.invalidateQueries({
        predicate: (query) => {
          const url = query.queryKey[0];
          return typeof url === "string" && pattern.test(url);
        },
      });
    },
    [queryClient],
  );

  return { invalidateByPattern };
};

/** Clears the cached pages and fetches the query again from its first page. */
export const useRefreshQuery = (queryKey: unknown[]) => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshInProgress = useRef(false);

  const refresh = useCallback(async () => {
    if (refreshInProgress.current) return;

    refreshInProgress.current = true;
    setIsRefreshing(true);
    try {
      await queryClient.resetQueries({ queryKey, exact: true });
    } finally {
      refreshInProgress.current = false;
      setIsRefreshing(false);
    }
  }, [queryClient, queryKey]);

  return { refresh, isRefreshing };
};
