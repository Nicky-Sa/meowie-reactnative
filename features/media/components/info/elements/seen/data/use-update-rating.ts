import { ID } from "@/features/common/data/media-query";
import {
  useInvalidateByPattern,
  useMutationConfigured,
} from "@/features/common/data/query/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { MediaType } from "@/features/common/data/models/media-type";
import {
  LibraryStatusResDto,
  RatingReqDto,
} from "@/features/profile/data/dto/library.dto";
import { SuccessResponse } from "@/features/common/data/transformers";

type Args = {
  id: ID;
  mediaType: MediaType;
};

export const useUpdateRating = ({ id, mediaType }: Args) => {
  const cacheKey = `/library/${mediaType}/${id}/status`;
  const queryClient = useQueryClient();
  const { invalidateByPattern } = useInvalidateByPattern();

  const { mutateAsync, ...rest } = useMutationConfigured<
    RatingReqDto,
    LibraryStatusResDto
  >(`/library/${mediaType}/${id}/seen`);

  const updateRating = async (rating: number | null) => {
    await queryClient.cancelQueries({ queryKey: [cacheKey] });
    const previousData = queryClient.getQueryData<
      SuccessResponse<LibraryStatusResDto>
    >([cacheKey]);

    // Optimistic update
    queryClient.setQueryData<SuccessResponse<LibraryStatusResDto>>(
      [cacheKey],
      (old) => {
        if (!old) return old;
        return { ...old, data: { ...old.data, rating } };
      },
    );

    try {
      await mutateAsync({
        method: "PATCH",
        body: { rating },
      });
    } catch {
      if (previousData) queryClient.setQueryData([cacheKey], previousData);
    } finally {
      await queryClient.invalidateQueries({ queryKey: [cacheKey] });
    }

    await invalidateByPattern(/\/library\/seen.*/); // Invalidate seen list
  };

  return { updateRating, ...rest };
};
