import { OMDB_Source } from "@/features/movies/movies-info/models/omdb";

type RatingEntry = {
  source: OMDB_Source | "The Movie Database";
  value: string;
}[];

export type AllRatings = {
  ratings: RatingEntry;
};
