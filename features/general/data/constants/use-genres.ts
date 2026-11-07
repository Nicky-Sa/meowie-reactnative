import { useMemo } from "react";
import { useQueryConfigured } from "@/features/common/data/query/hooks";
import { Genre } from "@/features/common/data/models/genre";

type GenresResDto = {
  movieGenres: Genre[];
  seriesGenres: Genre[];
};

export const useGenres = () => {
  const url = "/constants/genres";

  const { data: response, ...rest } = useQueryConfigured<GenresResDto>(url);
  const data = response?.data;

  const genreById = useMemo(() => {
    const map: Record<number, Genre> = {};
    for (const genre of [
      ...(data?.movieGenres ?? []),
      ...(data?.seriesGenres ?? []),
    ]) {
      map[genre.id] = genre;
    }
    return map;
  }, [data]);

  const genreEmoji = (id: number): string => genreById[id]?.emoji ?? "🎬";
  const genreName = (id: number): string => genreById[id]?.name ?? "";

  return {
    data,
    genreEmoji,
    genreName,
    ...rest,
  };
};
