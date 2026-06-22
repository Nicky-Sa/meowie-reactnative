import { useFetchFeed } from "@/features/media/data/use-fetch-feed";
import { MediaList } from "@/features/media/components/list/media-list";
import { ScrollHandlerProcessed, SharedValue } from "react-native-reanimated";
import { useAtomValue } from "jotai";
import { sortAtom } from "@/atoms";

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
  const sort = useAtomValue(sortAtom);
  const {
    data,
    dataLength,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
    onRefresh,
    isRefreshing,
  } = useFetchFeed({ mediaType: "series" });

  return (
    <MediaList
      data={data}
      dataLength={dataLength}
      isLoading={isLoading}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      error={error}
      refetch={refetch}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
      scrollToTopIfChanges={sort}
      currentIndex={currentIndex}
      scrollY={scrollY}
      scrollHandler={scrollHandler}
      isActive={isActive}
    />
  );
};
