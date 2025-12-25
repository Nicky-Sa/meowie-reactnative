import { View } from "react-native";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import Animated from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { ErrorState } from "@/features/general/error-state";
import { useScrollHandler } from "@/features/movies/hooks/useScrollHandler";
import { Poster } from "@/features/person/elements/poster";
import { useFetchMore } from "@/features/movies/hooks/useFetchMore";
import { usePosterWidth } from "@/features/person/hooks/usePosterWidth";
import { useCallback } from "react";
import { useFetchMoviesPoster } from "@/features/person/data/poster/useFetchMoviesPoster";
import LottieView from "lottie-react-native";
import { MoviePosterInfo } from "@/features/movies/movies-info/models/movie-info";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFetchPersonInfo } from "@/features/person/data/person/useFetchPersonInfo";
import { PersonBrief } from "@/features/person/elements/brief";
import { SkeletonItem } from "@/features/common/skeleton-item";

const NUM_COLUMNS = 3;

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<MoviePosterInfo>,
);

export const Screen = () => {
  const { personId: personIdStr } = useLocalSearchParams<{
    personId: string;
  }>();
  const personId = Number(personIdStr);
  const { posterWidth } = usePosterWidth({ numColumns: NUM_COLUMNS });

  const { scrollHandler, scrollY } = useScrollHandler();
  const { data: personData } = useFetchPersonInfo(personId);

  const {
    data,
    isLoading,
    size,
    setSize,
    totalPages,
    error,
    mutate,
    isValidating,
  } = useFetchMoviesPoster({ personId });

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
        pathname: "/person/movies-info",
        params: {
          initialIndex: index,
          personId,
        },
      });
    },
    [personId, router],
  );
  return (
    <InnerScreen
      title={personData?.name}
      scrollY={scrollY}
      fullHeight
      fullWidth
    >
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
        numColumns={NUM_COLUMNS}
        onScroll={scrollHandler}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          error ? (
            <ErrorState tryAgain={mutate} error={error} />
          ) : isInitialLoad ? (
            <PostersSkeleton width={posterWidth} />
          ) : null
        }
        ListHeaderComponent={<ListHeader personId={personId} />}
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
    </InnerScreen>
  );
};

const ListHeader = ({ personId }: { personId: number }) => {
  const { data, isLoading } = useFetchPersonInfo(personId);

  return (
    <View className={"px-4 pb-4"}>
      <PersonBrief data={data} isLoading={isLoading} size={"lg"} />
    </View>
  );
};

const PostersSkeleton = ({ width }: { width: number }) => {
  const height = width * (3 / 2);
  return (
    <View className={"flex flex-row flex-wrap"}>
      {Array.from({ length: NUM_COLUMNS * 3 }).map((_, index) => (
        <SkeletonItem
          key={index}
          className={"rounded-none border border-neutral-4-default"}
          style={{ width, height }}
        />
      ))}
    </View>
  );
};
