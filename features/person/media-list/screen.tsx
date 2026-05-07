import { MediaListScreen } from "@/features/media/components/list/media-list-screen";
import { useFetchPosters } from "@/features/common/posters/useFetchPosters";
import { useAtom } from "jotai";
import { currentRoleInMediaAtom } from "@/atoms";

export const Screen = ({
  title,
  initialIndex,
  personId,
}: {
  title: string;
  initialIndex?: string;
  personId: string;
}) => {
  const [currentRoleInMedia] = useAtom(currentRoleInMediaAtom);

  const posterData = useFetchPosters(`/person/${personId}/posters`, {
    personId,
  });

  return (
    <MediaListScreen
      title={title}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      subtitle={currentRoleInMedia}
      posterData={posterData}
    />
  );
};
