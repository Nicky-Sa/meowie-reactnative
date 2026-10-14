import {
  useInvalidateByPattern,
  useMutationConfigured,
} from "@/features/common/data/query/hooks";
import { useCallback } from "react";
import { SaveTasteReqDto } from "@/features/taste/data/dto/taste.dto";

export const useSaveTaste = () => {
  const { invalidateByPattern } = useInvalidateByPattern();
  const url = "/taste";

  const { mutateAsync, ...rest } = useMutationConfigured<SaveTasteReqDto, void>(
    url,
    {
      onSuccess: async () => {
        await invalidateByPattern(/^\/(user\/current|feed)/);
      },
    },
  );

  const trigger = useCallback(
    async (body: SaveTasteReqDto) => {
      await mutateAsync({ method: "PUT", body });
    },
    [mutateAsync],
  );

  return { trigger, ...rest };
};
