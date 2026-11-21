import { ExpandablePoster } from "@/features/common/posters/expandable-poster";
import {
  GridPoster,
  PostersGrid,
} from "@/features/common/posters/posters-grid";
import { ScrollHandlerProcessed } from "react-native-reanimated";
import { FlashListProps, FlashListRef } from "@shopify/flash-list";
import { PosterInfo } from "@/features/common/data/models/poster";
import { useFetchMore } from "@/features/common/hooks/list/use-fetch-more";
import { ReactElement, RefObject, useCallback, memo } from "react";
import { Loading } from "@/features/common/ui/loading";
import { ScrollViewProps, StyleProp, ViewStyle } from "react-native";
import { PosterHookResult } from "@/features/common/posters/types";

type Props = {
  numColumns?: number;
  onPosterPress: (index: number) => void;
  posterData: PosterHookResult;
  scrollHandler?: ScrollHandlerProcessed;
  ListHeaderComponent?: ReactElement;
  ListEmptyComponent?: ReactElement;
  contentContainerStyle?: StyleProp<ViewStyle>;
  contentInsetAdjustmentBehavior?: ScrollViewProps["contentInsetAdjustmentBehavior"];
  refreshControl?: ScrollViewProps["refreshControl"];
  listRef?: RefObject<FlashListRef<PosterInfo> | null>;
  maintainVisibleContentPosition?: FlashListProps<PosterInfo>["maintainVisibleContentPosition"];
};

/** The poster grid for pages of posters: loads the next page near the end, and a tap opens the title. */
export const PostersList = memo(
  ({
    numColumns,
    onPosterPress,
    posterData,
    scrollHandler,
    ListHeaderComponent,
    ListEmptyComponent,
    contentContainerStyle,
    contentInsetAdjustmentBehavior,
    refreshControl,
    listRef,
    maintainVisibleContentPosition,
  }: Props) => {
    const {
      data,
      isLoading,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      error,
      refetch,
    } = posterData;

    const { onEndReached } = useFetchMore({
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
    });

    const isInitialLoad = isLoading && data.length === 0;

    const renderPoster = useCallback(
      ({ item, index }: GridPoster<PosterInfo>) => (
        <ExpandablePoster data={item} onPress={() => onPosterPress(index)} />
      ),
      [onPosterPress],
    );

    return (
      <PostersGrid
        data={data}
        numColumns={numColumns}
        keyExtractor={({ id, mediaType }) => `${mediaType}-${id}`}
        renderPoster={renderPoster}
        isLoading={isInitialLoad}
        error={error}
        refetch={refetch}
        onEndReached={onEndReached}
        scrollHandler={scrollHandler}
        listRef={listRef}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={
          isFetchingNextPage && !isInitialLoad ? <Loading /> : null
        }
        contentContainerStyle={contentContainerStyle}
        contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
        refreshControl={refreshControl}
        maintainVisibleContentPosition={maintainVisibleContentPosition}
      />
    );
  },
);

PostersList.displayName = "PostersList";
