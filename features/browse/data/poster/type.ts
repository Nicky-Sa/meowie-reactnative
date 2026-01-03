import { SearchParams } from "@/features/common/data/query";
import { MovieStateQuery } from "@/features/profile/data/query";

export type PosterURL = "/movies/poster" | "/movie-states/poster";
export type PosterQueryParams = Partial<SearchParams> | MovieStateQuery;

export type PosterAPIDetails = {
  url: PosterURL;
  queryParams: PosterQueryParams;
};
