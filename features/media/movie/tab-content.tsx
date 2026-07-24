import { useFetchFeed } from "@/features/media/data/use-fetch-feed";
import { MediaList } from "@/features/media/components/list/media-list";
import { useVibeCard } from "@/features/taste/vibe-card/use-vibe-card";
import { ScrollHandlerProcessed, SharedValue } from "react-native-reanimated";

type Props = {
  currentIndex: number;
  scrollY: SharedValue<number>;
  scrollHandler: ScrollHandlerProcessed;
  isActive: boolean;
};

export const TabContent = ({
  currentIndex,
  scrollY,
  scrollHandler,
  isActive,
}: Props) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
    onRefresh,
    isRefreshing,
  } = useFetchFeed({ mediaType: "movie" });
  const { withVibeCard } = useVibeCard();
  const feedData = withVibeCard(data, "movie");

  return (
    <MediaList
      data={feedData}
      dataLength={feedData.length}
      isLoading={isLoading}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      error={error}
      refetch={refetch}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
      currentIndex={currentIndex}
      scrollY={scrollY}
      scrollHandler={scrollHandler}
      isActive={isActive}
    />
  );
};
