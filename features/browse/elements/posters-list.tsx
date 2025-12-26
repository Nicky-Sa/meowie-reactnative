import { Poster } from "@/features/browse/elements/poster";
import { ErrorState } from "@/features/general/error-state";
import { PostersSkeletons } from "@/features/browse/elements/poster-skeletons";
import LottieView from "lottie-react-native";
import Animated, { ScrollHandlerProcessed } from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { MoviePosterInfo } from "@/features/movies/movies-info/models/movie-info";
import { usePosterWidth } from "@/features/browse/hooks/usePosterWidth";
import { useFetchMoviesPoster } from "@/features/browse/data/poster/useFetchMoviesPoster";
import { useFetchMore } from "@/features/movies/hooks/useFetchMore";
import { useRouter } from "expo-router";
import { ReactElement, useCallback } from "react";
import { SearchParams } from "@/features/common/data/query";

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<MoviePosterInfo>,
);

type Props = {
  moviesListTitle: string | undefined;
  numColumns: number;
  searchParams: Partial<SearchParams>;
  scrollHandler?: ScrollHandlerProcessed;
  ListHeaderComponent?: ReactElement;
};

export const PostersList = ({
  moviesListTitle,
  numColumns,
  searchParams,
  scrollHandler,
  ListHeaderComponent,
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

  const router = useRouter();
  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/browse/movies-info",
        params: {
          initialIndex: index,
          title: moviesListTitle,
          ...searchParams,
        },
      });
    },
    [router, searchParams, moviesListTitle],
  );

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
      ListEmptyComponent={
        error ? (
          <ErrorState tryAgain={mutate} error={error} />
        ) : isInitialLoad ? (
          <PostersSkeletons width={posterWidth} number={numColumns * 4} />
        ) : null
      }
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        (isLoading || isValidating) && !isInitialLoad ? (
          <LottieView
            source={{
              uri: "https://lottie.host/099429f0-1128-4b7b-9e48-562fb873b761/eQhxLE6Pc5.lottie",
            }}
            autoPlay
            loop
            resizeMode={"cover"}
            style={{ alignSelf: "center", width: 48, height: 20 }}
          />
        ) : null
      }
    />
  );
};
