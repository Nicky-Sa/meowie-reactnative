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
  config?: SWRConfiguration<SuccessResponse<Data>, Err>,
) => {
  const [size, setSize] = useState(1);
  const [data, setData] = useImmer<SuccessResponse<Data>[] | undefined>(
    undefined,
  );

  const previousPageData = data ? data[size - 2] || null : null;
  const key = getKey(size - 1, previousPageData);

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
          newArray[size - 1] = currentPageData;
          return newArray;
        }

        // Case B: State is an array.
        // Mutate the draft directly.
        // Reference check to prevent infinite loops:
        if (!_.isEqual(draft[size - 1], currentPageData)) {
          draft[size - 1] = castDraft(currentPageData); // Cast helps TS infer the draft type correctly if strict
        }
      });
    }
  }, [currentPageData, size, setData]);

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
      pattern?: string,
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
        } else if (key.includes(pattern)) {
          mutations.push(mutate(key, data, opts));
        }
      }

      await Promise.all(mutations);
    },
    [cache, mutate],
  );

  return { revalidateByPattern };
};
