import useSWR, {
  SWRConfiguration,
  useSWRConfig,
  MutatorCallback,
  MutatorOptions,
} from "swr";
import { fetcher, MutationArg } from "@/features/common/data/fetcher";
import { SuccessResponse } from "@/features/common/data/transformers";
import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";
import { useCallback } from "react";
import useSWRInfinite, { SWRInfiniteConfiguration } from "swr/infinite";
import { Cache } from "@/features/common/data/swr/cache";

type SWRKey = string | null;

export const useSWRConfigured = <Data, Err = Error>(
  key: SWRKey,
  config?: SWRConfiguration<SuccessResponse<Data>, Err>,
) => {
  return useSWR<SuccessResponse<Data>, Err>(key, fetcher, config);
};

// Replacement for useSWRInfinite to support pagination and caching!
export type SWRInfiniteKeyLoader<Data> = (
  index: number,
  previousPageData: SuccessResponse<Data> | null,
) => SWRKey;

export const useSWRPaginatedConfigured = <Data, Err = Error>(
  getKey: SWRInfiniteKeyLoader<Data>,
  config?: SWRInfiniteConfiguration<SuccessResponse<Data>, Err>,
) => {
  return useSWRInfinite<SuccessResponse<Data>, Err>(getKey, fetcher, config);
};

export const useSWRMutationConfigured = <REQ, RES, Err = Error>(
  key: SWRKey,
  config?: SWRMutationConfiguration<
    SuccessResponse<RES>,
    Err,
    SWRKey,
    MutationArg<REQ>
  >,
) => {
  return useSWRMutation<SuccessResponse<RES>, Err, SWRKey, MutationArg<REQ>>(
    key,
    fetcher,
    config,
  );
};

export const useSWRConfigTyped = () => {
  const { cache, ...rest } = useSWRConfig();
  return {
    cache: cache as Cache<unknown>,
    ...rest,
  };
};

export const useRevalidateByPattern = () => {
  const { mutate, cache } = useSWRConfigTyped();

  const revalidateByPattern = useCallback(
    async <Data, MutationData>(
      pattern?: RegExp,
      data?:
        | MutationData
        | Promise<MutationData>
        | MutatorCallback<MutationData>,
      opts?: boolean | MutatorOptions<Data, MutationData>,
    ): Promise<string[]> => {
      const keys = Array.from(cache.keys());
      const mutations: Promise<MutationData | undefined>[] = [];
      const mutatedKey: string[] = [];

      for (const key of keys) {
        if (!pattern) {
          // No pattern provided, mutate all keys
          mutations.push(mutate(key, data, opts));
          mutatedKey.push(key);
        } else if (pattern.test(key)) {
          mutations.push(mutate(key, data, opts));
          mutatedKey.push(key);
        }
      }

      await Promise.all(mutations);
      return mutatedKey;
    },
    [cache, mutate],
  );

  return { revalidateByPattern };
};
