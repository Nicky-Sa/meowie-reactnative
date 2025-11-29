import { useFetchMoviesIds } from "@/features/movies/data/useFetchMoviesIds";
import { View } from "react-native";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { Person } from "@/features/movies/deep-dive/elements/person";
import Animated from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { MoviesErrorState } from "@/features/movies/elements/error-state";
import { MoviesEmptyState } from "@/features/movies/elements/empty-state";
import { useScrollHandler } from "@/features/movies/movie-info/hooks/useScrollHandler";
import { Poster } from "@/features/movies/deep-dive/elements/poster";
import { useScreenDimensions } from "@/hooks/useScreenDimensions";
import { tailwind } from "@/lib/utils";

type Props = {
  personId: number;
};

const NUM_COLUMNS = 3;

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<number>);

export const Content = ({ personId }: Props) => {
  const { data, dataLength, setSize, error, mutate } = useFetchMoviesIds();

  const { scrollHandler, scrollY, currentIndex } = useScrollHandler({
    dataLength,
    setSize,
  });

  const { width } = useScreenDimensions();
  const availableWidth = width - 2 * Number(tailwind.theme.spacing[4]); // for padding x
  const posterWidth = Math.floor(availableWidth / NUM_COLUMNS);

  return (
    <InnerScreen>
      <View className={"flex w-full flex-col items-start gap-8"}>
        <Person personId={personId} />
      </View>
      {error ? (
        <MoviesErrorState tryAgain={mutate} error={error} />
      ) : dataLength > 0 ? (
        <AnimatedFlashList
          data={data}
          keyExtractor={(id, index) => `movie-${id}-${index}`}
          renderItem={({ item: movieId }) => (
            <Poster key={movieId} movieId={movieId} width={posterWidth} />
          )}
          numColumns={NUM_COLUMNS}
          onScroll={scrollHandler}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <MoviesEmptyState />
      )}
    </InnerScreen>
  );
};
