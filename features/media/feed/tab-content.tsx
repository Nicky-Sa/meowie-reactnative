import { useCallback } from "react";
import { Platform, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFetchFeed } from "@/features/media/data/use-fetch-feed";
import { MediaList } from "@/features/media/components/list/media-list";
import { MediaListItemData } from "@/features/media/components/list/types";
import { MediaType } from "@/features/common/data/models/media-type";
import { useListRef } from "@/features/common/hooks/list/use-list-ref";
import { usePullToRefresh } from "@/features/common/hooks/list/use-pull-to-refresh";
import { RefreshIndicator } from "@/features/common/ui/refresh-indicator";
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
  const listRef = useListRef<MediaListItemData>();
  const insets = useSafeAreaInsets();

  const handleRefresh = useCallback(() => {
    if (isRefreshing) return;

    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    resetScroll();
    onRefresh();
  }, [isRefreshing, listRef, resetScroll, onRefresh]);

  const { isReadyToRefresh } = usePullToRefresh({
    scrollY,
    isDragging,
    onRefresh: handleRefresh,
    isRefreshing,
    isActive,
  });

  return (
    <>
      <MediaList
        data={data}
        isLoading={isLoading}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        error={error}
        refetch={refetch}
        listRef={listRef}
        refreshControl={
          // hiding Android's default loading indicator
          Platform.OS === "android" && isActive ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={["transparent"]}
              progressBackgroundColor="transparent"
            />
          ) : undefined
        }
        currentIndex={currentIndex}
        scrollY={scrollY}
        isDragging={isDragging}
        scrollHandler={scrollHandler}
        isActive={isActive}
      />
      {(isReadyToRefresh || isRefreshing) && (
        <RefreshIndicator top={insets.top + 56} />
      )}
    </>
  );
};
