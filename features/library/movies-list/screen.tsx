import { MoviesListScreen } from "@/features/common/movies-list/movies-list-screen";
import { useLocalSearchParams } from "expo-router";
import { useFetchLibraryPosters } from "@/features/common/posters/useFetchLibraryPosters";

export const Screen = () => {
  const { title, initialIndex, url } = useLocalSearchParams<{
    title: string;
    initialIndex: string;
    url: `/library/${string}`;
  }>();

  const posterData = useFetchLibraryPosters(url);

  return (
    <MoviesListScreen
      title={title}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      posterData={posterData}
    />
  );
};
