import {
  useInvalidateByPattern,
  useMutationConfigured,
} from "@/features/common/data/query/hooks";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  SubmitTasteReqDto,
  SubmitTasteResDto,
} from "@/features/taste/data/dto/taste.dto";

export const useSubmitTaste = () => {
  const queryClient = useQueryClient();
  const { invalidateByPattern } = useInvalidateByPattern();
  const url = "/taste";

  const { mutateAsync, ...rest } = useMutationConfigured<
    SubmitTasteReqDto,
    SubmitTasteResDto
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
    async (body: SubmitTasteReqDto) => {
      await mutateAsync({ method: "POST", body });
    },
    [mutateAsync],
  );

  return { trigger, ...rest };
};
