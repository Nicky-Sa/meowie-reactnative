import { ID } from "@/features/common/data/media-query";
import {
  useRevalidateByPattern,
  useSWRConfigTyped,
  useSWRMutationConfigured,
} from "@/features/common/data/swr/hooks";
import { LibraryCategory } from "@/features/profile/data/library.constants";
import { MediaType } from "@/features/common/data/models/media-type";
import {
  LibraryStatusResDto,
  ToggleLibraryItemReqDto,
} from "@/features/profile/data/dto/library.dto";

type Args = {
  id: ID;
  mediaType: MediaType;
  category: LibraryCategory;
};

export const useToggleLibraryItem = ({ id, mediaType, category }: Args) => {
  const url = "/library";
  const cacheKey = `/library/status/${mediaType}/${id}`;
  const { mutate } = useSWRConfigTyped();
  const { revalidateByPattern } = useRevalidateByPattern();

  const { trigger: swrTrigger, ...rest } = useSWRMutationConfigured<
    ToggleLibraryItemReqDto,
    LibraryStatusResDto
  >(url);

  const trigger = async (currentState: boolean) => {
    try {
      // Use global mutate to update the specific reading cache key
      await mutate(
        cacheKey,
        swrTrigger({
          method: "POST",
          body: {
            tmdbId: Number(id),
            mediaType,
            category,
          },
        }),
        {
          optimisticData: (currentData) => {
            return {
              ...currentData,
              data: {
                ...currentData.data,
                [category]: !currentState,
              },
            };
          },
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        },
      );

      await revalidateByPattern(new RegExp(`/library/${category}.*`)); // Revalidate library saved/seen list
    } catch (error) {
      console.log({ error });
    }
  };

  return { trigger, ...rest };
};
