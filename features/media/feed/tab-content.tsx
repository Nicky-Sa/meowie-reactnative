import { useFetchFeed } from "@/features/media/data/use-fetch-feed";
import { MediaList } from "@/features/media/components/list/media-list";
import { MediaType } from "@/features/common/data/models/media-type";
import { ScrollHandlerProcessed, SharedValue } from "react-native-reanimated";

type Props = {
  mediaType: MediaType;
  currentIndex: number;
  scrollY: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  scrollHandler: ScrollHandlerProcessed;
  isActive: boolean;
  resetScroll: () => void;
};

export const TabContent = ({
  mediaType,
  currentIndex,
  scrollY,
  isDragging,
  scrollHandler,
  isActive,
  resetScroll,
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
  } = useFetchFeed({ mediaType });

  return (
    <MediaList
      data={data}
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
      isDragging={isDragging}
      scrollHandler={scrollHandler}
      isActive={isActive}
      resetScroll={resetScroll}
    />
  );
};
