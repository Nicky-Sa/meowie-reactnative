import { useFetchInterestingTvIds } from "@/features/media/tv/data/useFetchInterestingTvIds";
import { MediaList } from "@/features/media/components/list/media-list";
import { ScrollHandlerProcessed, SharedValue } from "react-native-reanimated";
import { useAtomValue } from "jotai";
import { sortAtom } from "@/atoms";

type Props = {
  currentIndex: number;
  scrollY: SharedValue<number>;
  scrollHandler: ScrollHandlerProcessed;
  isActive: boolean;
};

export const Content = ({
  currentIndex,
  scrollY,
  scrollHandler,
  isActive,
}: Props) => {
  const sort = useAtomValue(sortAtom);
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
  } = useFetchInterestingTvIds({ sort });

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
      isActive={isActive}
    />
  );
};
