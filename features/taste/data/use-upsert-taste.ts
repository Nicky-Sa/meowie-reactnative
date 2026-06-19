import { useMutationConfigured } from "@/features/common/data/query/hooks";
import {
  TasteResDto,
  UpsertTasteReqDto,
} from "@/features/taste/data/dto/upsert-taste.dto";
import { KeywordId } from "@/features/taste/data/use-taste-items";

export const useUpsertTaste = () => {
  const { mutateAsync, ...rest } = useMutationConfigured<
    UpsertTasteReqDto,
    TasteResDto
  >("/taste");

  const upsertTaste = async (keywords: KeywordId[], flexibility: number) => {
    return mutateAsync({
      method: "PUT",
      body: { keywords, flexibility },
    });
  };

  return { upsertTaste, ...rest };
};
