import { Poster } from "@/features/common/posters/poster";
import { ErrorState } from "@/features/general/error-state";
import { PostersSkeletons } from "@/features/common/posters/poster-skeletons";
import Animated, { ScrollHandlerProcessed } from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { PosterInfo } from "@/features/common/data/models/poster";
import { usePosterWidth } from "@/features/common/posters/usePosterWidth";
import { useFetchMore } from "@/features/common/hooks/list/useFetchMore";
import { ReactElement } from "react";
import { Loading } from "@/features/common/ui/loading";
import { StyleProp, ViewStyle } from "react-native";
import { PosterHookResult } from "@/features/common/posters/types";

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
};

export const PostersList = ({
  numColumns,
  onPosterPress,
  posterData,
  scrollHandler,
  ListHeaderComponent,
  ListEmptyComponent,
  contentContainerStyle,
}: Props) => {
  const { posterWidth } = usePosterWidth({ numColumns });

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

  return (
    <AnimatedFlashList
      data={data}
      keyExtractor={({ id, mediaType }) => `${mediaType}-${id}`}
      renderItem={({ item, index }) => (
        <Poster
          data={item}
          width={posterWidth}
          onPress={() => onPosterPress(index)}
        />
      )}
      numColumns={numColumns}
      onScroll={scrollHandler}
      onEndReachedThreshold={0.5}
      onEndReached={onEndReached}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName={"grow"}
      contentContainerStyle={contentContainerStyle}
      ListEmptyComponent={
        error ? (
          <ErrorState tryAgain={refetch} error={error} />
        ) : isInitialLoad ? (
          <PostersSkeletons width={posterWidth} number={numColumns * 4} />
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
};
