import {
  useInvalidateByPattern,
  useMutationConfigured,
} from "@/features/common/data/query/hooks";
import {
  TasteResDto,
  SaveTasteReqDto,
} from "@/features/taste/data/dto/taste.dto";

export const useSaveTaste = () => {
  const { invalidateByPattern } = useInvalidateByPattern();
  const url = "/taste";

  const { mutateAsync, ...rest } = useMutationConfigured<
    SaveTasteReqDto,
    TasteResDto
  >(url, {
    onSuccess: async () => {
      // The stored profile changed, the user now has hasFilledInTaste set, and
      // the feed must refetch so the new taste takes effect (the backend drops
      // its built feed pool on save).
      await invalidateByPattern(/^\/(taste$|user\/current|feed)/);
    },
  });

  const trigger = async (body: SaveTasteReqDto) => {
    const response = await mutateAsync({ method: "PUT", body });
    return response.data;
  };

  return { trigger, ...rest };
};
