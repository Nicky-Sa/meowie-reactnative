import { KeywordId } from "@/features/taste/data/use-taste-items";

export type UpsertTasteReqDto = {
  keywords: KeywordId[];
  flexibility: number;
};

export type TasteResDto = {
  keywords: KeywordId[];
  flexibility: number;
};
