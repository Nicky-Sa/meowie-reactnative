import { JourneyResDto } from "@/features/taste/data/dto/journey.dto";

/**
 * The genres the picked titles lock — one per title, the genre shown on its
 * poster. Movie and series ids are separate namespaces and can collide, so
 * each pool is matched against its own picks.
 */
export const lockedGenreIds = (
  journey: JourneyResDto | undefined,
  movieIds: number[],
  seriesIds: number[],
): number[] => {
  const picked = [
    ...(journey?.movies ?? []).filter((movie) =>
      movieIds.includes(movie.tmdbId),
    ),
    ...(journey?.series ?? []).filter((series) =>
      seriesIds.includes(series.tmdbId),
    ),
  ];

  return [...new Set(picked.map((title) => title.mainGenreId))];
};
