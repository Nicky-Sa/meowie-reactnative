import { ID } from "@/features/common/data/media-query";
import {
  useInvalidateByPattern,
  useMutationConfigured,
} from "@/features/common/data/query/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { LibraryStatusResDto } from "@/features/profile/data/dto/library.dto";
import { SuccessResponse } from "@/features/common/data/transformers";

type Args = {
  id: ID;
  mediaType: MediaType;
};

export const useMarkAsSaved = ({ id, mediaType }: Args) => {
  const cacheKey = `/library/${mediaType}/${id}/status`;
  const queryClient = useQueryClient();
  const { invalidateByPattern } = useInvalidateByPattern();

  const { mutateAsync, ...rest } = useMutationConfigured<
    undefined,
    LibraryStatusResDto
  >(`/library/${mediaType}/${id}/saved`);

  const markAsSaved = async () => {
    await queryClient.cancelQueries({ queryKey: [cacheKey] });
    const previousData = queryClient.getQueryData<
      SuccessResponse<LibraryStatusResDto>
    >([cacheKey]);

    // Optimistic update
    queryClient.setQueryData<SuccessResponse<LibraryStatusResDto>>(
      [cacheKey],
      (old) => {
        if (!old) return old;
        return { ...old, data: { ...old.data, saved: true } };
      },
    );

    try {
      await mutateAsync({
        method: "PUT",
      });
    } catch {
      if (previousData) queryClient.setQueryData([cacheKey], previousData);
    } finally {
      await queryClient.invalidateQueries({ queryKey: [cacheKey] });
    }

    await invalidateByPattern(/\/library\/saved.*/); // Invalidate saved list
  };

  return { markAsSaved, ...rest };
};
