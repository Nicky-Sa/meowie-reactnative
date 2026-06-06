import { ID } from "@/features/common/data/media-query";
import { useMutationConfigured } from "@/features/common/data/query/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { LibraryStatusResDto } from "@/features/profile/data/dto/library.dto";
import { SuccessResponse } from "@/features/common/data/transformers";

type Args = {
  id: ID;
  mediaType: MediaType;
};

export const useRemoveSaved = ({ id, mediaType }: Args) => {
  const cacheKey = `/library/${mediaType}/${id}/status`;
  const queryClient = useQueryClient();

  const { mutateAsync, ...rest } = useMutationConfigured<
    undefined,
    LibraryStatusResDto
  >(`/library/${mediaType}/${id}/saved`);

  const removeSaved = async () => {
    await queryClient.cancelQueries({ queryKey: [cacheKey] });
    const previousData = queryClient.getQueryData<
      SuccessResponse<LibraryStatusResDto>
    >([cacheKey]);

    // Optimistic update
    queryClient.setQueryData<SuccessResponse<LibraryStatusResDto>>(
      [cacheKey],
      (old) => {
        if (!old) return old;
        return { ...old, data: { ...old.data, saved: false } };
      },
    );

    try {
      await mutateAsync({
        method: "DELETE",
      });
    } catch {
      if (previousData) queryClient.setQueryData([cacheKey], previousData);
    } finally {
      await queryClient.invalidateQueries({ queryKey: [cacheKey] });
    }
  };

  return { removeSaved, ...rest };
};
