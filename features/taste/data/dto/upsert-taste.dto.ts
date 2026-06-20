import { KeywordId } from "@/features/taste/step-1/data/use-taste-items";

export type UpsertTasteReqDto = {
  keywords: KeywordId[];
  flexibility: string;
};

export type TasteResDto = {
  keywords: KeywordId[];
  flexibility: string;
};
