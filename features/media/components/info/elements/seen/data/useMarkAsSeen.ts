import { ID } from "@/features/common/data/media-query";
import {
  useInvalidateByPattern,
  useMutationConfigured,
} from "@/features/common/data/query/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { MediaType } from "@/features/common/data/models/media-type";
import {
  LibraryStatusResDto,
  MarkSeenReqDto,
} from "@/features/profile/data/dto/library.dto";
import { SuccessResponse } from "@/features/common/data/transformers";

type Args = {
  id: ID;
  mediaType: MediaType;
};

export const useMarkAsSeen = ({ id, mediaType }: Args) => {
  const cacheKey = `/library/status/${mediaType}/${id}`;
  const queryClient = useQueryClient();
  const { invalidateByPattern } = useInvalidateByPattern();

  const { mutateAsync, ...rest } = useMutationConfigured<
    MarkSeenReqDto,
    LibraryStatusResDto
  >("/library/seen");

  const markAsSeen = async (rating?: number) => {
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
          data: { ...old.data, seen: true, rating: rating ?? null },
        };
      },
    );

    try {
      await mutateAsync({
        method: "POST",
        body: { tmdbId: Number(id), mediaType, rating },
      });
    } catch {
      if (previousData) queryClient.setQueryData([cacheKey], previousData);
    } finally {
      await queryClient.invalidateQueries({ queryKey: [cacheKey] });
    }

    await invalidateByPattern(/\/library\/seen.*/); // Invalidate seen list
  };

  return { markAsSeen, ...rest };
};
