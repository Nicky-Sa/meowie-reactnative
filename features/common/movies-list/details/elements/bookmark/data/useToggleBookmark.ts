import {
  ToggleBookmarkReqDto,
  ToggleBookmarkResDto,
} from "@/features/common/movies-list/details/elements/bookmark/data/dto/toggle-bookmark.dto";
import { fetcher, MutationArg } from "@/features/common/data/fetcher";
import { SuccessResponse } from "@/features/common/data/transformers";
import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { ID } from "@/features/common/data/query";

type Args = {
  id: ID;
};

export const useToggleBookmark = ({ id }: Args) => {
  const url = "/movie-states/bookmark";
  const cacheKey = `/movie-states/${id}`;
  const { mutate } = useSWRConfig();

  const { trigger: swrTrigger, ...rest } = useSWRMutation<
    SuccessResponse<ToggleBookmarkResDto>,
    Error,
    string,
    MutationArg<ToggleBookmarkReqDto>
  >(url, fetcher);

  const trigger = async (currentState: boolean) => {
    // Use global mutate to update the specific reading cache key
    return mutate(
      cacheKey,
      // Pass the mutation promise here
      swrTrigger({
        method: "POST",
        body: { id: Number(id) },
      }),
      {
        optimisticData: (currentData) => ({
          ...currentData,
          data: {
            ...currentData?.data,
            bookmarked: !currentState,
          },
        }),
        rollbackOnError: true,
        populateCache: true, // Updates cache with real server response when done
        revalidate: false, // Prevent double-fetching immediately after
      },
    );
  };

  return { trigger, ...rest };
};
