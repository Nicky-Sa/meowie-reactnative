import { Poster } from "@/features/common/posters/poster";
import { ErrorState } from "@/features/general/error-state";
import { PostersSkeletons } from "@/features/common/posters/poster-skeletons";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  ScrollHandlerProcessed,
} from "react-native-reanimated";
import { FlashList, FlashListProps, FlashListRef } from "@shopify/flash-list";
import { PosterInfo } from "@/features/common/data/models/poster";
import { useGridItemWidth } from "@/features/common/hooks/list/use-grid-item-width";
import { useFetchMore } from "@/features/common/hooks/list/use-fetch-more";
import { ReactElement, RefObject, useCallback, memo } from "react";
import { Loading } from "@/features/common/ui/loading";
import { ScrollViewProps, StyleProp, ViewStyle, View } from "react-native";
import { PosterHookResult } from "@/features/common/posters/types";
import { tailwind } from "@/lib/tailwind";

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<PosterInfo>,
);

type Props = {
  numColumns: number;
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

export const PostersList = memo(
  ({
    numColumns,
    onPosterPress,
    posterData,
    scrollHandler,
    ListHeaderComponent,
    ListEmptyComponent,
    contentContainerStyle,
    contentInsetAdjustmentBehavior = "automatic",
    refreshControl,
    listRef,
    maintainVisibleContentPosition,
  }: Props) => {
    const gap = Number(tailwind.theme.spacing["2"]);
    const { itemWidth } = useGridItemWidth({
      numColumns,
      gap,
      horizontalPadding: gap * 2,
    });

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

    const isInitialLoad = isLoading && (!data || data.length === 0);

    const renderItem = useCallback(
      ({ item, index }: { item: PosterInfo; index: number }) => (
        <Animated.View
          className={"px-1"}
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(300)}
          layout={LinearTransition.duration(400)}
          key={`${item.mediaType}-${item.id}`}
        >
          <Poster
            data={item}
            width={itemWidth}
            onPress={() => onPosterPress(index)}
          />
        </Animated.View>
      ),
      [onPosterPress, itemWidth],
    );

    return (
      <AnimatedFlashList
        ref={listRef}
        data={data}
        keyExtractor={({ id, mediaType }) => `${mediaType}-${id}`}
        renderItem={renderItem}
        numColumns={numColumns}
        onScroll={scrollHandler}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
        refreshControl={refreshControl}
        maintainVisibleContentPosition={maintainVisibleContentPosition}
        contentContainerClassName={"grow px-1"}
        contentContainerStyle={contentContainerStyle}
        ItemSeparatorComponent={() => <View className={"h-2"} />}
        ListEmptyComponent={
          error ? (
            <ErrorState tryAgain={refetch} error={error} />
          ) : isInitialLoad ? (
            <PostersSkeletons width={itemWidth} number={numColumns * 4} />
          ) : (
            ListEmptyComponent
          )
        }
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={
          isFetchingNextPage && !isInitialLoad ? <Loading /> : null
        }
      />
    );
  },
);

PostersList.displayName = "PostersList";
