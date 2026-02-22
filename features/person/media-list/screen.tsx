import { MediaListScreen } from "@/features/media/components/list/media-list-screen";
import { useLocalSearchParams } from "expo-router";
import { useFetchPosters } from "@/features/common/posters/useFetchPosters";
import { useAtom } from "jotai";
import { currentMovieIdAtom } from "@/atoms";
import { useFetchRole } from "@/features/person/data/useFetchRole";

export const Screen = () => {
  const { title, initialIndex, personId } = useLocalSearchParams<{
    title: string;
    initialIndex: string;
    personId: string;
  }>();

  const [currentMovieId] = useAtom(currentMovieIdAtom);

  const posterData = useFetchPosters(`/person/${personId}/posters`, {
    personId,
  });

  const { data: roleInMovie, isLoading: isRoleInMovieLoading } = useFetchRole(
    personId,
    currentMovieId,
  );

  return (
    <MediaListScreen
      title={title}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      subtitle={currentMovieId ? roleInMovie?.role : undefined}
      subtitleIsLoading={isRoleInMovieLoading}
      posterData={posterData}
    />
  );
};
