import { ID } from "@/features/common/data/media-query";
import { useMutationConfigured } from "@/features/common/data/query/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { MediaType } from "@/features/common/data/models/media-type";
import {
  LibraryStatusResDto,
  RemoveItemReqDto,
} from "@/features/profile/data/dto/library.dto";
import { SuccessResponse } from "@/features/common/data/transformers";

type Args = {
  id: ID;
  mediaType: MediaType;
};

export const useRemoveSeen = ({ id, mediaType }: Args) => {
  const cacheKey = `/library/status/${mediaType}/${id}`;
  const queryClient = useQueryClient();

  const { mutateAsync, ...rest } = useMutationConfigured<
    RemoveItemReqDto,
    LibraryStatusResDto
  >("/library/seen");

  const removeSeen = async () => {
    await queryClient.cancelQueries({ queryKey: [cacheKey] });
    const previousData = queryClient.getQueryData<
      SuccessResponse<LibraryStatusResDto>
    >([cacheKey]);

    // Optimistic update
    queryClient.setQueryData<SuccessResponse<LibraryStatusResDto>>(
      [cacheKey],
      (old) => {
        if (!old) return old;
        return {
          ...old,
          data: { ...old.data, seen: false, rating: null },
        };
      },
    );

    try {
      await mutateAsync({
        method: "DELETE",
        body: { tmdbId: Number(id), mediaType },
      });
    } catch {
      if (previousData) queryClient.setQueryData([cacheKey], previousData);
    } finally {
      await queryClient.invalidateQueries({ queryKey: [cacheKey] });
    }
  };

  return { removeSeen, ...rest };
};
