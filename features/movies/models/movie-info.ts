export type CastInfo = {
  id: number;
  name: string;
  character: string;
  profilePath: string;
};

export type Credits = {
  casts: CastInfo[];
  director: CastInfo;
};

export type MoviePosterInfo = {
  title: unknown;
  id: number;
  posterPath: string;
  blurhash: string;
};
