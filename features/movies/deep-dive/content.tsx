import { useFetchMoviesIds } from "@/features/movies/data/useFetchMoviesIds";
import { View } from "react-native";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { Person } from "@/features/movies/deep-dive/elements/person";
import Animated from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { ErrorState } from "@/features/general/error-state";
import { MoviesEmptyState } from "@/features/movies/elements/empty-state";
import { useScrollHandler } from "@/features/movies/movie-info/hooks/useScrollHandler";
import { Poster } from "@/features/movies/deep-dive/elements/poster";
import { filtersAtom } from "@/atoms";
import { useAtom } from "jotai";
import { useFetchMore } from "@/features/movies/movie-info/hooks/useFetchMore";
import { usePosterWidth } from "@/features/movies/deep-dive/hooks/usePosterWidth";
import { useCallback } from "react";

type Props = {
  personId: number;
  personName: string;
};

const NUM_COLUMNS = 3;

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<number>);
// Dummy data to render a scrollable skeleton
const skeletonData = new Array(NUM_COLUMNS * 3).fill({ id: -1 });

export const Content = ({ personId, personName }: Props) => {
  const { posterWidth } = usePosterWidth({ numColumns: NUM_COLUMNS });
  const [, setFilters] = useAtom(filtersAtom);
  const onBack = useCallback(() => {
    setFilters((draft) => {
      draft["personId"] = undefined;
    });
  }, [setFilters]);

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

  const { scrollHandler, scrollY } = useScrollHandler();

  const { onEndReached } = useFetchMore({
    size,
    setSize,
    isLoading,
    totalPages,
  });

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
          data={isLoading ? skeletonData : data}
          keyExtractor={(id, index) => `movie-${id}-${index}`}
          renderItem={({ item: movieId }) => (
            <Poster key={movieId} movieId={movieId} width={posterWidth} />
          )}
          numColumns={NUM_COLUMNS}
          onScroll={scrollHandler}
          onEndReachedThreshold={2}
          onEndReached={onEndReached}
          showsVerticalScrollIndicator={false}
          getItemType={() => (isLoading ? "skeleton" : "actual")} // Tell FlashList that 'skeleton' and 'actual' are different layouts\
          ListHeaderComponent={<PersonHeader personId={personId} />}
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
