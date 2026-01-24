import { SearchParams } from "@/features/common/data/query";
import { MovieStateQuery } from "@/features/profile/data/query";

export type PosterAPIDetails =
  | {
      url: "/movies/poster";
      queryParams: Partial<SearchParams>;
    }
  | {
      url: "/movie-states/poster";
      queryParams: MovieStateQuery;
    };
