import { MoviesListScreen } from "@/features/common/movies-list/movies-list-screen";
import { useLocalSearchParams } from "expo-router";
import { useFetchMoviePosters } from "@/features/common/posters/useFetchMoviePosters";
import { useAtom } from "jotai";
import { currentMovieIdAtom } from "@/atoms";
import { useFetchRoleInMovie } from "@/features/person/data/useFetchRoleInMovie";

export const Screen = () => {
  const { title, initialIndex, personId } = useLocalSearchParams<{
    title: string;
    initialIndex: string;
    personId: string;
  }>();

  const [currentMovieId] = useAtom(currentMovieIdAtom);

  const posterData = useFetchMoviePosters({ personId });

  const { data: roleInMovie, isLoading: isRoleInMovieLoading } =
    useFetchRoleInMovie(personId, currentMovieId);

  return (
    <MoviesListScreen
      title={title}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      subtitle={currentMovieId ? roleInMovie?.role : undefined}
      subtitleIsLoading={isRoleInMovieLoading}
      posterData={posterData}
    />
  );
};
