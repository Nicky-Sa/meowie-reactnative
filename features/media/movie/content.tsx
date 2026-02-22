import { useFetchInterestingMoviesIds } from "@/features/media/movie/data/useFetchInterestingMoviesIds";
import { MediaList } from "@/features/media/components/list/media-list";
import { useLocalSearchParams } from "expo-router";
import { initialSort, SortOption } from "@/features/common/data/media-query";
import { ScrollHandlerProcessed, SharedValue } from "react-native-reanimated";

type Props = {
  currentIndex: number;
  scrollY: SharedValue<number>;
  scrollHandler: ScrollHandlerProcessed;
  onLoad: () => void;
};

export const Content = ({
  currentIndex,
  scrollY,
  scrollHandler,
  onLoad,
}: Props) => {
  const { sort = initialSort } = useLocalSearchParams<{ sort: SortOption }>();
  const {
    data,
    dataLength,
    size,
    setSize,
    totalPages,
    isLoading,
    isValidating,
    error,
    mutate,
  } = useFetchInterestingMoviesIds({ sort });

  return (
    <MediaList
      data={data}
      dataLength={dataLength}
      isLoading={isLoading}
      isValidating={isValidating}
      size={size}
      setSize={setSize}
      totalPages={totalPages}
      error={error}
      mutate={mutate}
      scrollToTopIfChanges={sort}
      currentIndex={currentIndex}
      scrollY={scrollY}
      scrollHandler={scrollHandler}
      onLoad={onLoad}
      mediaType="movie"
    />
  );
};
