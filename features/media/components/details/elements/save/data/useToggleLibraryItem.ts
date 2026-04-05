import { ID } from "@/features/common/data/media-query";
import {
  useInvalidateByPattern,
  useMutationConfigured,
} from "@/features/common/data/query/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { LibraryCategory } from "@/features/profile/data/library.constants";
import { MediaType } from "@/features/common/data/models/media-type";
import {
  LibraryStatusResDto,
  ToggleLibraryItemReqDto,
} from "@/features/profile/data/dto/library.dto";
import { SuccessResponse } from "@/features/common/data/transformers";

type Args = {
  id: ID;
  mediaType: MediaType;
  category: LibraryCategory;
};

export const useToggleLibraryItem = ({ id, mediaType, category }: Args) => {
  const url = "/library";
  const cacheKey = `/library/status/${mediaType}/${id}`;
  const queryClient = useQueryClient();
  const { invalidateByPattern } = useInvalidateByPattern();

  const { mutateAsync, ...rest } = useMutationConfigured<
    ToggleLibraryItemReqDto,
    LibraryStatusResDto
  >(url);

  const trigger = async (currentState: boolean) => {
    try {
      // Optimistic update on the specific library status cache entry
      await queryClient.cancelQueries({ queryKey: [cacheKey] });

      const previousData = queryClient.getQueryData<
        SuccessResponse<LibraryStatusResDto>
      >([cacheKey]);

      queryClient.setQueryData<SuccessResponse<LibraryStatusResDto>>(
        [cacheKey],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              [category]: !currentState,
            },
          };
        },
      );

      try {
        await mutateAsync({
          method: "POST",
          body: {
            tmdbId: Number(id),
            mediaType,
            category,
          },
        });
      } catch {
        // Rollback on error
        if (previousData) {
          queryClient.setQueryData([cacheKey], previousData);
        }
      }

      await invalidateByPattern(new RegExp(`/library/${category}.*`)); // Invalidate library saved/seen list
    } catch (error) {
      console.log({ error });
    }
  };

  return { trigger, ...rest };
};
