import {
  ToggleBookmarkReqDto,
  ToggleBookmarkResDto,
} from "@/features/common/movies-list/details/elements/bookmark/data/dto/toggle-bookmark.dto";
import { useSWRConfig } from "swr";
import { ID } from "@/features/common/data/query";
import {
  useRevalidateByPattern,
  useSWRMutationConfigured,
} from "@/features/common/data/swr-config";

type Args = {
  id: ID;
};

export const useToggleBookmark = ({ id }: Args) => {
  const url = "/movie-states/bookmark";
  const cacheKey = `/movie-states/${id}`;
  const { mutate } = useSWRConfig();
  const { revalidateByPattern } = useRevalidateByPattern();

  const { trigger: swrTrigger, ...rest } = useSWRMutationConfigured<
    ToggleBookmarkReqDto,
    ToggleBookmarkResDto
  >(url);

  const trigger = async (currentState: boolean) => {
    try {
      // Use global mutate to update the specific reading cache key
      await mutate(
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

      await revalidateByPattern("/movie-states/poster");
    } catch (error) {
      console.log({ error });
    }
  };

  return { trigger, ...rest };
};
