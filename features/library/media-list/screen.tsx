import { MediaListScreen } from "@/features/media/components/list/media-list-screen";
import { useLocalSearchParams } from "expo-router";
import { useFetchPosters } from "@/features/common/posters/useFetchPosters";
import { SavedEmptyState } from "@/features/profile/logged-in/saved/saved-empty-state";

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
      posterData={posterData}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      ListEmptyComponent={<SavedEmptyState />}
    />
  );
};
