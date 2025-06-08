import { OMDB_Source } from "@/components/movies/models/omdb/info";

type RatingEntry = {
  source: OMDB_Source | "The Movie Database";
  value: string;
}[];

export type AllRatings = {
  ratings: RatingEntry;
};
