import { MoviesListScreen } from "@/features/common/movies-list/movies-list-screen";
import { useLocalSearchParams } from "expo-router";
import { useFetchMoviePosters } from "@/features/common/posters/useFetchMoviePosters";
import { SearchParams } from "@/features/common/data/media-query";

export const Screen = () => {
  const { title, initialIndex, ...queryParams } = useLocalSearchParams<
    {
      title: string;
      initialIndex: string;
    } & Partial<SearchParams>
  >();

  const posterData = useFetchMoviePosters(queryParams);

  return (
    <MoviesListScreen
      title={title}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      posterData={posterData}
    />
  );
};
