import {
  GenreId,
  JourneyResDto,
  Title,
} from "@/features/taste/data/dto/journey.dto";

export type GenreAutoSelection = {
  label: GenreId;
  titleCount: number;
  score: number;
  movieHits: number;
  seriesHits: number;
  matchTag: "Strong match" | "Rare find";
};

const poolByTmdbId = (pool: Title[]): Map<number, Title> =>
  new Map(pool.map((title) => [title.tmdbId, title]));

/**
 * For each genre: titleCount = how many selected titles carry it,
 * score = titleCount * rarity weight. Auto-select when score >= the threshold.
 * Returns one entry per auto-selected genre with its source split + match tag.
 */
export const genreAutoselect = (
  journey: JourneyResDto,
  moviesSelected: number[],
  seriesSelected: number[],
): GenreAutoSelection[] => {
  const movieById = poolByTmdbId(journey.movies);
  const seriesById = poolByTmdbId(journey.series);

  const countsByGenre = new Map<
    GenreId,
    { titleCount: number; movieHits: number; seriesHits: number }
  >();

  const add = (tmdbId: number, pool: "movie" | "series") => {
    const title =
      pool === "movie" ? movieById.get(tmdbId) : seriesById.get(tmdbId);
    for (const genre of title?.genreIds ?? []) {
      const entry = countsByGenre.get(genre) ?? {
        titleCount: 0,
        movieHits: 0,
        seriesHits: 0,
      };
      entry.titleCount += 1;
      if (pool === "movie") entry.movieHits += 1;
      else entry.seriesHits += 1;
      countsByGenre.set(genre, entry);
    }
  };

  moviesSelected.forEach((tmdbId) => add(tmdbId, "movie"));
  seriesSelected.forEach((tmdbId) => add(tmdbId, "series"));

  const selected: GenreAutoSelection[] = [];
  for (const [label, { titleCount, movieHits, seriesHits }] of countsByGenre) {
    const score = titleCount * (journey.rarityWeights[label] ?? 1.0);
    if (score >= journey.autoSelectThreshold) {
      selected.push({
        label,
        titleCount,
        score,
        movieHits,
        seriesHits,
        matchTag: titleCount >= 2 ? "Strong match" : "Rare find",
      });
    }
  }
  return selected;
};
