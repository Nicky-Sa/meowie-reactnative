import useSWR, {
  SWRConfiguration,
  useSWRConfig,
  MutatorCallback,
  MutatorOptions,
} from "swr";
import { fetcher, MutationArg } from "@/features/common/data/fetcher";
import { SuccessResponse } from "@/features/common/data/transformers";
import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";
import { useState, useEffect, useCallback } from "react";
import { useImmer } from "use-immer";
import _ from "lodash";
import { castDraft } from "immer";

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
  config?: SWRConfiguration<SuccessResponse<Data>, Err> & {
    initialSize?: number;
  },
) => {
  const [size, setSize] = useState(config?.initialSize || 1);
  const [data, setData] = useImmer<SuccessResponse<Data>[] | undefined>(
    undefined,
  );

  // Bridging logic: If we have gaps (e.g. size is 3 but data only has page 1),
  // we find the FIRST missing index and fetch it. This sequentially fills the array.
  let targetIndex = size - 1;
  if (data) {
    const firstMissing = data.findIndex((page) => page === undefined);
    if (firstMissing !== -1 && firstMissing < size) {
      targetIndex = firstMissing;
    }
  }

  const previousPageData = data ? data[targetIndex - 1] || null : null;
  const key = getKey(targetIndex, previousPageData);

  const { data: currentPageData, ...rest } = useSWRConfigured<Data, Err>(
    key,
    config,
  );

  useEffect(() => {
    if (currentPageData) {
      setData((draft) => {
        // Case A: State is currently undefined.
        // We must return a NEW state to replace undefined (Immer rule).
        if (!draft) {
          const newArray = [];
          newArray[targetIndex] = currentPageData;
          return newArray;
        }
        // Case B: State is an array.
        // Mutate the draft directly.
        // Reference check to prevent infinite loops:
        if (!_.isEqual(draft[targetIndex], currentPageData)) {
          draft[targetIndex] = castDraft(currentPageData);
        }
      });
    }
  }, [currentPageData, targetIndex, setData]);

  return {
    data, // This matches the SWRInfinite return type (array of pages)
    size,
    setSize,
    ...rest,
  };
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

export const useRevalidateByPattern = () => {
  const { mutate, cache } = useSWRConfig();

  const revalidateByPattern = useCallback(
    async <Data, MutationData>(
      pattern?: RegExp,
      data?:
        | MutationData
        | Promise<MutationData>
        | MutatorCallback<MutationData>,
      opts?: boolean | MutatorOptions<Data, MutationData>,
    ) => {
      const keys = Array.from(cache.keys());
      const mutations = [];

      for (const key of keys) {
        if (!pattern) {
          // No pattern provided, mutate all keys
          mutations.push(mutate(key, data, opts));
        } else if (pattern.test(key)) {
          mutations.push(mutate(key, data, opts));
        }
      }

      await Promise.all(mutations);
    },
    [cache, mutate],
  );

  return { revalidateByPattern };
};
