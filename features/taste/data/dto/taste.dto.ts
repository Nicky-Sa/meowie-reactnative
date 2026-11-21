import { MediaType } from "@/features/common/data/models/media-type";

export type TitlePick = {
  tmdbId: number;
  mediaType: MediaType;
};

export type SubmitTasteReqDto = {
  picks: TitlePick[];
};

export type SubmitTasteResDto = {
  successful: boolean;
};
