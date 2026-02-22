import { MoviesListScreen } from "@/features/media/movie/movies-list-screen";
import { useLocalSearchParams } from "expo-router";
import { useFetchPosters } from "@/features/common/posters/useFetchPosters";
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

  const posterData = useFetchPosters({ personId }, "movie");

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
