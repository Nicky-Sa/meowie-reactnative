import { MediaType } from "@/features/common/data/models/media-type";
import { Genre } from "@/features/general/data/constants/use-genres";

export type PosterProps = {
  primaryColorHex: string;
  blurhash: string;
};

export type PosterInfo = {
  id: number;
  posterPath: string;
  blurhash: string;
  mediaType: MediaType;
  role?: string;
  preview: {
    title: string;
    genres: Genre[];
    overview: string;
  };
};
