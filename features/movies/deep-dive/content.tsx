import { useFetchMoviesIds } from "@/features/movies/data/useFetchMoviesIds";
import { View } from "react-native";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { Person } from "@/features/movies/deep-dive/elements/person";
import Animated from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { MoviesErrorState } from "@/features/movies/elements/error-state";
import { MoviesEmptyState } from "@/features/movies/elements/empty-state";
import { useScrollHandler } from "@/features/movies/movie-info/hooks/useScrollHandler";
import {
  Poster,
  PosterSkeleton,
} from "@/features/movies/deep-dive/elements/poster";
import { useScreenDimensions } from "@/hooks/useScreenDimensions";
import { tailwind } from "@/lib/utils";
import { filtersAtom } from "@/atoms";
import { useAtom } from "jotai";
import { useFetchMore } from "@/features/movies/movie-info/hooks/useFetchMore";

type Props = {
  personId: number;
};

const NUM_COLUMNS = 3;

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<number>);

export const Content = ({ personId }: Props) => {
  const { width } = useScreenDimensions();
  const availableWidth = width - 2 * Number(tailwind.theme.spacing[4]); // for padding x
  const posterWidth = Math.floor(availableWidth / NUM_COLUMNS);
  const onBack = () => {
    setFilters((draft) => {
      draft.personId = undefined;
    });
  };

  const {
    data,
    dataLength,
    size,
    setSize,
    totalPages,
    error,
    mutate,
    isLoading,
  } = useFetchMoviesIds();
  const [, setFilters] = useAtom(filtersAtom);

  const { scrollHandler } = useScrollHandler();

  const { onEndReached } = useFetchMore({
    size,
    setSize,
    isLoading,
    totalPages,
  });

  return (
    <InnerScreen onBack={onBack}>
      <View className={"flex w-full flex-col items-start gap-8"}>
        <Person personId={personId} />
      </View>
      {error ? (
        <MoviesErrorState tryAgain={mutate} error={error} />
      ) : isLoading ? (
        <PostersSkeleton numColumns={NUM_COLUMNS} width={posterWidth} />
      ) : dataLength > 0 ? (
        <AnimatedFlashList
          data={data}
          keyExtractor={(id, index) => `movie-${id}-${index}`}
          renderItem={({ item: movieId }) => (
            <Poster key={movieId} movieId={movieId} width={posterWidth} />
          )}
          numColumns={NUM_COLUMNS}
          onScroll={scrollHandler}
          onEndReachedThreshold={2}
          onEndReached={onEndReached}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <MoviesEmptyState />
      )}
    </InnerScreen>
  );
};

const PostersSkeleton = ({
  numColumns,
  width,
}: {
  numColumns: number;
  width: number;
}) => {
  return (
    <View className={"flex flex-row flex-wrap"}>
      {[...Array(numColumns * 3)].map((_, index) => (
        <PosterSkeleton key={index} width={width} />
      ))}
    </View>
  );
};
