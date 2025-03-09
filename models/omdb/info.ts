export type OMDB_RequiredInfo = {
  ratings: {
    source: OMDB_Source;
    value: string;
  }[];
};

type OMDB_Source = "Internet Movie Database" | "Rotten Tomatoes" | "Metacritic";
