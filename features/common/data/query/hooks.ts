import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
  InfiniteData,
} from "@tanstack/react-query";
import { fetcher, MutationArg } from "@/features/common/data/fetcher";
import { SuccessResponse } from "@/features/common/data/transformers";
import { useCallback } from "react";

/**
 * Configured useQuery hook with the app's fetcher and response shape.
 */
export const useQueryConfigured = <Data, Err = Error>(
  url: string,
  config?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
    refetchOnWindowFocus?: boolean;
    refetchInterval?: number | false;
  },
) => {
  const result = useQuery<SuccessResponse<Data>, Err>({
    queryKey: [url],
    queryFn: () => fetcher<unknown, Data>(url),
    ...config,
  });

  return result;
};

/**
 * Configured useInfiniteQuery hook for paginated fetching.
 * Wraps React Query's useInfiniteQuery with the app's fetcher.
 */
export const useQueryPaginatedConfigured = <
  Data extends { page: number; total_pages: number },
  Err = Error,
>(
  queryKey: unknown[],
  urlResolver: (pageParam: number) => string,
  config?: { enabled?: boolean },
) => {
  const result = useInfiniteQuery<
    SuccessResponse<Data>,
    Err,
    InfiniteData<SuccessResponse<Data>>,
    readonly unknown[],
    number
  >({
    queryKey,
    queryFn: ({ pageParam }) => fetcher<unknown, Data>(urlResolver(pageParam)),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.page >= lastPage.data.total_pages) return undefined;
      return allPages.length;
    },
    ...config,
  });

  return {
    ...result,
    data: result.data?.pages,
    size: result.data?.pages.length ?? 0,
  };
};

/**
 * Configured useMutation hook for POST/PUT/DELETE operations.
 * Wraps React Query's useMutation with the app's fetcher.
 */
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

/**
 * Replacement for useRevalidateByPattern.
 * Uses React Query's invalidateQueries with predicate matching.
 */
export const useInvalidateByPattern = () => {
  const queryClient = useQueryClient();

  const invalidateByPattern = useCallback(
    async (pattern?: RegExp): Promise<void> => {
      await queryClient.invalidateQueries({
        predicate: (query) => {
          if (!pattern) return true; // No pattern provided, invalidate all

          // Match pattern against the first element of the query key (the URL string)
          const queryKey = query.queryKey[0];
          return typeof queryKey === "string" && pattern.test(queryKey);
        },
      });
    },
    [queryClient],
  );

  return { invalidateByPattern };
};
