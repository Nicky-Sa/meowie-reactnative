import { MoviesListScreen } from "@/features/media/movie/movies-list-screen";
import { useLocalSearchParams } from "expo-router";
import { useFetchPosters } from "@/features/common/posters/useFetchPosters";
import { SearchParams } from "@/features/common/data/media-query";

export const Screen = () => {
  const { title, initialIndex, ...queryParams } = useLocalSearchParams<
    {
      title: string;
      initialIndex: string;
    } & Partial<SearchParams>
  >();

  const posterData = useFetchPosters(queryParams, "movie");

  return (
    <MoviesListScreen
      title={title}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      posterData={posterData}
    />
  );
};
