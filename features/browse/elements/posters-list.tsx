import { Poster } from "@/features/browse/elements/poster";
import { ErrorState } from "@/features/general/error-state";
import { PostersSkeletons } from "@/features/browse/elements/poster-skeletons";
import Animated, { ScrollHandlerProcessed } from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { MoviePosterInfo } from "@/features/movies/models/movie-info";
import { usePosterWidth } from "@/features/browse/hooks/usePosterWidth";
import { useFetchMoviesPoster } from "@/features/browse/data/poster/useFetchMoviesPoster";
import { useFetchMore } from "@/features/browse/hooks/list/useFetchMore";
import { ReactElement } from "react";
import { SearchParams } from "@/features/common/data/query";
import { Loading } from "@/features/common/ui/loading";
import { StyleProp, Text, ViewStyle } from "react-native";

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<MoviePosterInfo>,
);

type Props = {
  numColumns: number;
  searchParams: Partial<SearchParams>;
  onPosterPress: (index: number) => void;
  scrollHandler?: ScrollHandlerProcessed;
  ListHeaderComponent?: ReactElement;
  ListEmptyComponent?: ReactElement;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const PostersList = ({
  numColumns,
  searchParams,
  onPosterPress,
  scrollHandler,
  ListHeaderComponent,
  ListEmptyComponent,
  contentContainerStyle,
}: Props) => {
  const { posterWidth } = usePosterWidth({ numColumns });

  const {
    data,
    isLoading,
    size,
    setSize,
    totalPages,
    error,
    mutate,
    isValidating,
  } = useFetchMoviesPoster(searchParams);

  const { onEndReached } = useFetchMore({
    size,
    setSize,
    isLoading,
    isValidating,
    totalPages,
  });

  const isInitialLoad = isLoading && (!data || data.length === 0);

  return (
    <AnimatedFlashList
      data={data}
      keyExtractor={({ id }) => `movie-${id}-poster`}
      renderItem={({ item, index }) => (
        <Poster
          key={item.id}
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
      contentContainerClassName={"grow"}
      contentContainerStyle={contentContainerStyle}
      ListEmptyComponent={
        error ? (
          <ErrorState tryAgain={mutate} error={error} />
        ) : isInitialLoad ? (
          <PostersSkeletons width={posterWidth} number={numColumns * 4} />
        ) : (
          ListEmptyComponent || (
            <Text className={"body-b1 text-neutral-10-default"}>No data</Text>
          )
        )
      }
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        (isLoading || isValidating) && !isInitialLoad ? <Loading /> : null
      }
    />
  );
};
