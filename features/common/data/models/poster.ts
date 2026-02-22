import { MediaType } from "@/features/common/data/models/media-type";

export type PosterProps = {
  primaryColorHex: string;
  blurhash: string;
};

export type PosterInfo = {
  id: number;
  posterPath: string;
  blurhash: string;
  mediaType: MediaType;
};
