import { MediaListScreen } from "@/features/media/components/list/media-list-screen";
import { useLocalSearchParams } from "expo-router";
import { useFetchPosters } from "@/features/common/posters/useFetchPosters";

export const Screen = () => {
  const { title, initialIndex, initialSize } = useLocalSearchParams<{
    title: string;
    initialIndex: string;
    initialSize: string;
  }>();

  const posterData = useFetchPosters(
    "/library/saved/",
    {},
    initialSize ? Number(initialSize) : undefined,
  );

  return (
    <MediaListScreen
      title={title}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      posterData={posterData}
    />
  );
};
