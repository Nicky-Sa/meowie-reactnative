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
import { useCallback } from "react";

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

type PaginatedConfig<Data, Err> = Omit<
  UseInfiniteQueryOptions<
    SuccessResponse<Data>,
    Err,
    InfiniteData<SuccessResponse<Data>>,
    readonly unknown[],
    number
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

export const useQueryPaginatedConfigured = <
  Data extends { page: number; total_pages: number },
  Err = Error,
>(
  queryKey: unknown[],
  urlForPage: (pageParam: number) => string,
  config?: PaginatedConfig<Data, Err>,
) => {
  const result = useInfiniteQuery<
    SuccessResponse<Data>,
    Err,
    InfiniteData<SuccessResponse<Data>>,
    readonly unknown[],
    number
  >({
    queryKey,
    queryFn: ({ pageParam }) => fetcher<unknown, Data>(urlForPage(pageParam)),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.page >= lastPage.data.total_pages) return undefined;
      return allPages.length;
    },
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
