import { KeywordId } from "@/features/taste/step-1/genre-data";

export type UpsertTasteReqDto = {
  keywords: KeywordId[];
  flexibility: number;
};

export type TasteResDto = {
  keywords: KeywordId[];
  flexibility: number;
};
