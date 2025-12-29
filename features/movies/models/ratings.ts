import { OMDB_Source } from "@/features/movies/models/omdb";

export type RatingEntry = {
  source: OMDB_Source | "The Movie Database";
  value: string;
};

export type AllRatings = {
  ratings: RatingEntry[];
};
