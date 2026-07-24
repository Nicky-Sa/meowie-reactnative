import {
  GenreId,
  JourneyResDto,
  Title,
} from "@/features/taste/data/dto/journey.dto";

const poolByTmdbId = (pool: Title[]): Map<number, Title> =>
  new Map(pool.map((title) => [title.tmdbId, title]));

/**
 * Every genre carried by the titles the user picked. All of them count the
 * same here — the feed's scoring is what weighs common against rare.
 */
export const genresFromPicks = (
  journey: JourneyResDto,
  moviesSelected: number[],
  seriesSelected: number[],
): GenreId[] => {
  const movieById = poolByTmdbId(journey.movies);
  const seriesById = poolByTmdbId(journey.series);

  const genres = new Set<GenreId>();
  const add = (title: Title | undefined) =>
    title?.genreIds.forEach((genre) => genres.add(genre));

  moviesSelected.forEach((tmdbId) => add(movieById.get(tmdbId)));
  seriesSelected.forEach((tmdbId) => add(seriesById.get(tmdbId)));

  return [...genres];
};
