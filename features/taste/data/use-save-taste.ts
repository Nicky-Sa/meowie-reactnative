import {
  useInvalidateByPattern,
  useMutationConfigured,
} from "@/features/common/data/query/hooks";
import { useCallback } from "react";
import {
  SaveTasteReqDto,
  SaveTasteResDto,
} from "@/features/taste/data/dto/taste.dto";

export const useSaveTaste = () => {
  const { invalidateByPattern } = useInvalidateByPattern();
  const url = "/taste";

  const { mutateAsync, ...rest } = useMutationConfigured<
    SaveTasteReqDto,
    SaveTasteResDto
  >(url, {
    onSuccess: async (response) => {
      if (response?.data?.successful) {
        await invalidateByPattern(/^\/(user\/current|feed)/);
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
