import {
  useInvalidateByPattern,
  useMutationConfigured,
} from "@/features/common/data/query/hooks";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  SaveTasteReqDto,
  SaveTasteResDto,
} from "@/features/taste/data/dto/taste.dto";

export const useSaveTaste = () => {
  const queryClient = useQueryClient();
  const { invalidateByPattern } = useInvalidateByPattern();
  const url = "/taste";

  const { mutateAsync, ...rest } = useMutationConfigured<
    SaveTasteReqDto,
    SaveTasteResDto
  >(url, {
    onSuccess: async (response) => {
      if (response?.data?.successful) {
        void queryClient.resetQueries({ queryKey: ["/feed/movie"] });
        void queryClient.resetQueries({ queryKey: ["/feed/series"] });
        await invalidateByPattern(/^\/user\/current$/);
      }
    },
  });

  const trigger = useCallback(
    async (body: SaveTasteReqDto) => {
      await mutateAsync({ method: "POST", body });
    },
    [mutateAsync],
  );

  return { trigger, ...rest };
};
