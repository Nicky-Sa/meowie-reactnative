import { useFetchInfo } from "@/features/movies/data/useFetchInfo";
import { View, Text } from "react-native";
import { TrailerPlayer } from "@/features/movies/elements/trailer-player";
import { memo, useEffect } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useAtom } from "jotai";
import { colorAtom } from "@/atoms";
import { GoogleMore } from "@/features/movies/elements/google-more";
import { Ratings } from "@/features/movies/elements/ratings";
import { ScrollView } from "react-native-gesture-handler";
import { MoviesErrorState } from "@/features/movies/elements/error-state";
import { useMovieContentStyle } from "@/features/movies/hooks";
import { MoviesSkeleton } from "@/features/movies/elements/skeleton";
import { Genres } from "@/features/movies/elements/genres";
import { Image } from "expo-image";
import { tailwind } from "@/lib/utils";
import { Casts } from "@/features/movies/elements/casts";

type Props = {
  movieId: number;
  shouldPlay: boolean;
  index: number;
  scrollY: SharedValue<number>;
};

const casts = [
  {
    name: "Christian Bale",
    avatar:
      "https://m.media-amazon.com/images/M/MV5BMTkxMzk4MjQ4MF5BMl5BanBnXkFtZTcwMzExODQxOA@@._V1_FMjpg_UY2048_.jpg",
  },
  {
    name: "Heath Ledger",
    avatar:
      "https://hips.hearstapps.com/hmg-prod/images/heath_ledger_getty_images_photo_bob_riha_jr_wireimage_116948085.jpg?resize=1800:*",
  },
  {
    name: "Aaron Eckhart",
    avatar:
      "https://www.acmodasi.in/amdb/images/persons/2/r/aaron-eckhart-6246.jpg",
  },
  {
    name: "Maggie Gyllenhaal",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Maggie_Gyllenhaal_2021.jpg/500px-Maggie_Gyllenhaal_2021.jpg",
  },
];

export const DetailsContainer = memo(
  ({ movieId, shouldPlay, index, scrollY }: Props) => {
    const { data: response, isLoading, error, mutate } = useFetchInfo(movieId);
    const [, setColor] = useAtom(colorAtom);

    const contentStyle = useMovieContentStyle();
    const { height } = contentStyle;
    const data = response?.data;

    useEffect(() => {
      if (shouldPlay && data?.posterProps.primaryColorHex)
        setColor(data.posterProps.primaryColorHex);
    }, [data?.posterProps, setColor, shouldPlay]);

    // Animated styles for scaling and opacity
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * height,
        index * height,
        (index + 1) * height,
      ];

      const scale = interpolate(
        scrollY.value,
        inputRange,
        [1.2, 1, 0.8], // Scale down as you scroll away
      );

      const opacity = interpolate(
        scrollY.value,
        inputRange,
        [0.1, 1, 0.1], // Fade out as you scroll away
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    if (error) {
      return <MoviesErrorState tryAgain={mutate} />;
    }

    return (
      <Animated.View
        style={[animatedStyle]}
        className={"h-full w-full flex-1 justify-start"}
      >
        {isLoading || !data ? (
          <MoviesSkeleton />
        ) : (
          <View
            className={
              "relative mx-4 flex flex-col items-start justify-start gap-4"
            }
            style={contentStyle}
          >
            <View
              className={
                "flex w-full flex-row items-stretch justify-start gap-2"
              }
            >
              <Image
                source={data.posterPath}
                style={{
                  flexBasis: "15%",
                  aspectRatio: 2 / 3,
                  borderRadius: Number(tailwind.theme.borderRadius.lg),
                }}
                contentFit="cover"
                placeholder={{
                  blurhash: data.posterProps.blurhash,
                  width: 100,
                  height: 150,
                }}
                transition={500}
              />
              <View className={"flex flex-col justify-center gap-2"}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className={"-mx-2 grow-0"}
                  contentContainerClassName={"min-w-full"}
                >
                  <Text
                    className={"title-t1-strong px-2 text-neutral-10-default"}
                  >
                    {data.title}
                  </Text>
                </ScrollView>
                <View className={"flex flex-row gap-5"}>
                  <Text className={"body-b2 text-neutral-5-default"}>
                    {data.publishYear}
                  </Text>
                  <Text className={"body-b2 text-neutral-5-default"}>
                    {data.certification}
                  </Text>
                  <Text className={"body-b2 text-neutral-5-default"}>
                    {data.duration}
                  </Text>
                </View>
                <Text className={"caption-c1-strong text-neutral-10-default"}>
                  Christopher Nolan
                </Text>
              </View>
            </View>

            <TrailerPlayer YTKey={data.trailerKey} shouldPlay={shouldPlay} />

            <Ratings ratings={data.ratings} />

            <Text
              numberOfLines={4}
              ellipsizeMode="tail"
              className={"body-b2 overflow-hidden text-neutral-6-default"}
            >
              {data.overview}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className={"-mx-4 grow-0"}
              contentContainerClassName={"min-w-full"}
            >
              <Genres genres={data.genres} />
            </ScrollView>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className={"-mx-4 grow-0"}
              contentContainerClassName={"min-w-full"}
            >
              <Casts casts={casts} />
            </ScrollView>

            <GoogleMore title={data.title} />
          </View>
        )}
      </Animated.View>
    );
  },
);
DetailsContainer.displayName = "DetailsContainer";
