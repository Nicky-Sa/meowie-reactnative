import { View } from "react-native";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { Person } from "@/features/movies/deep-dive/elements/person";
import Animated from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { ErrorState } from "@/features/general/error-state";
import { MoviesEmptyState } from "@/features/movies/elements/empty-state";
import { useScrollHandler } from "@/features/movies/hooks/useScrollHandler";
import { Poster } from "@/features/movies/deep-dive/elements/poster";
import { filtersAtom } from "@/atoms";
import { useAtom } from "jotai";
import { useFetchMore } from "@/features/movies/hooks/useFetchMore";
import { usePosterWidth } from "@/features/movies/deep-dive/hooks/usePosterWidth";
import { useCallback } from "react";
import { useFetchMoviesPoster } from "@/features/movies/deep-dive/data/poster/useFetchMoviesPoster";
import LottieView from "lottie-react-native";
import { MoviePosterInfo } from "@/features/movies/movies-info/models/movie-info";
import { useRouter } from "expo-router";

type Props = {
  personId: number;
  personName: string;
};

const NUM_COLUMNS = 3;

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<MoviePosterInfo>,
);

// Dummy data to render an initial scrollable skeleton
const skeletonData: MoviePosterInfo[] = Array.from({
  length: NUM_COLUMNS * 3,
}).map((_, index) => ({
  id: -index - 1, // Generates -1, -2, -3... distinct IDs for skeletons
  posterPath: "",
  blurhash: "",
}));

export const Content = ({ personId, personName }: Props) => {
  const { posterWidth } = usePosterWidth({ numColumns: NUM_COLUMNS });
  const [, setFilters] = useAtom(filtersAtom);
  const onBack = useCallback(() => {
    setFilters((draft) => {
      draft["personId"] = undefined;
    });
  }, [setFilters]);

  const { scrollHandler, scrollY } = useScrollHandler();

  const {
    data,
    dataLength,
    isLoading,
    size,
    setSize,
    totalPages,
    error,
    mutate,
    isValidating,
  } = useFetchMoviesPoster();

  const { onEndReached } = useFetchMore({
    size,
    setSize,
    isLoading,
    totalPages,
  });
  const isInitialLoad = isLoading && (!data || data.length === 0);

  const router = useRouter();
  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/deep-dive/movies-info",
        params: {
          initialIndex: index,
          personName,
        },
      });
    },
    [personName, router],
  );

  return (
    <InnerScreen
      onBack={onBack}
      title={personName}
      scrollY={scrollY}
      fullHeight
      fullWidth
    >
      {error ? (
        <>
          <PersonHeader personId={personId} />
          <ErrorState tryAgain={mutate} error={error} />
        </>
      ) : isLoading || dataLength > 0 ? (
        <AnimatedFlashList
          data={isInitialLoad ? skeletonData : data}
          keyExtractor={({ id }) => `movie-${id}-poster`}
          renderItem={({ item, index }) => (
            <Poster
              key={item.id}
              data={item}
              isSkeletonData={isInitialLoad}
              width={posterWidth}
              onPress={() => onPosterPress(index)}
            />
          )}
          numColumns={NUM_COLUMNS}
          onScroll={scrollHandler}
          onEndReachedThreshold={0.5}
          onEndReached={onEndReached}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<PersonHeader personId={personId} />}
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
      ) : (
        <>
          <PersonHeader personId={personId} />
          <MoviesEmptyState />
        </>
      )}
    </InnerScreen>
  );
};

const PersonHeader = ({ personId }: { personId: number }) => {
  return (
    <View className={"px-4 pb-4"}>
      <Person personId={personId} />
    </View>
  );
};
