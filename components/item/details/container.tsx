import { useFetchInfo } from "@/hooks/data/useFetchInfo";
import {
  View,
  Text,
  Image,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { TrailerPlayer } from "@/components/item/details/trailer-player";
import IMDBLogo from "@/assets/icons/ratings/imdb.svg";
import RottenTomatoLogo from "@/assets/icons/ratings/rotten-tomato.svg";
import MetacriticLogo from "@/assets/icons/ratings/metacritic.svg";
import { useFetchColor } from "@/hooks/useFetchColor";
import { memo, useEffect } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useAtom } from "jotai";
import { colorAtom } from "@/atoms";
import { GoogleIt } from "@/components/item/details/google-it";
import { Bento } from "@/components/common/bento";
import Rive, { Alignment } from "rive-react-native";
import { Button } from "@/components/common/button";

type Props = {
  id: number;
  shouldPlay: boolean;
  shouldFetch: boolean;
  index: number;
  scrollY: SharedValue<number>;
};

export const DetailsContainer = memo(
  ({ id, shouldPlay, shouldFetch, index, scrollY }: Props) => {
    const { isLoading, data, error, mutate } = useFetchInfo(id, shouldFetch);
    const fetchedColor = useFetchColor(data?.posterPath);
    const [, setColor] = useAtom(colorAtom);

    const { height } = useWindowDimensions();

    useEffect(() => {
      if (shouldPlay) setColor(fetchedColor);
    }, [fetchedColor, setColor, shouldPlay]);

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

    if (isLoading || !data) {
      return (
        <View
          className={"flex-1 items-center justify-center"}
          style={{
            height,
          }}
        />
      );
    }

    if (!error) {
      return (
        <Animated.View
          style={[
            {
              height,
            },
            animatedStyle, // Apply animated styles
          ]}
          className={"w-full flex-1 flex-col items-center justify-center"}
        >
          <View className={"-mt-1 h-[50%] w-[50%]"}>
            <Rive
              url="https://meowie-public.s3.eu-central-1.amazonaws.com/meowie-error-state.riv"
              alignment={Alignment.Center}
            />
          </View>

          <Text className={"body-b1"}>We have a problem, please try again</Text>
          <Button>Retry</Button>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        style={[
          {
            height,
          },
          animatedStyle, // Apply animated styles
        ]}
        className={`w-full flex-1 justify-end`}
      >
        <View
          className={
            "gap-1.5 flex w-full flex-col items-start justify-center px-4 xs:gap-3"
          }
          style={{
            height: height * 0.9,
          }}
        >
          <Bento>
            <View className={"flex flex-col gap-1"}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className={"-mx-4 flex grow-0"}
              >
                <Text
                  className={"title-t1-strong text-neutral-10-default px-4"}
                >
                  {data.title}
                </Text>
              </ScrollView>
              <View className={"flex flex-row gap-8"}>
                <Text className={"body-b1 text-neutral-5-default"}>
                  {data.publishYear}
                </Text>
                <Text className={"body-b1 text-neutral-5-default"}>
                  {data.certification}
                </Text>
                <Text className={"body-b1 text-neutral-5-default"}>
                  {data.duration}
                </Text>
              </View>
            </View>
          </Bento>

          <Bento hasPadding={false}>
            <TrailerPlayer YTKey={data.trailerKey} shouldPlay={shouldPlay} />
          </Bento>

          <Bento>
            <View className={"flex flex-col gap-2"}>
              <View className={"flex flex-row items-center gap-8"}>
                <View className={"flex flex-row items-center gap-2"}>
                  <IMDBLogo />
                  <Text className={"body-b1 text-neutral-5-default"}>
                    {data.ratings.find(
                      (rating) => rating.source === "Internet Movie Database",
                    )?.value ?? "N/A"}
                  </Text>
                </View>
                <View className={"flex flex-row items-center gap-2"}>
                  <RottenTomatoLogo />
                  <Text className={"body-b1 text-neutral-5-default"}>
                    {data.ratings.find(
                      (rating) => rating.source === "Rotten Tomatoes",
                    )?.value ?? "N/A"}
                  </Text>
                </View>
                <View className={"flex flex-row items-center gap-2"}>
                  <MetacriticLogo />
                  <Text className={"body-b1 text-neutral-5-default"}>
                    {data.ratings.find(
                      (rating) => rating.source === "Metacritic",
                    )?.value ?? "N/A"}
                  </Text>
                </View>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className={"w-full grow-0 overflow-visible"}
                contentContainerClassName={"flex flex-row gap-6"}
              >
                {data.genres.map((genre, index) => (
                  <Text
                    key={genre}
                    className={"body-b2-strong text-neutral-5-default"}
                  >
                    {genre}
                  </Text>
                ))}
              </ScrollView>
            </View>
          </Bento>

          <Bento>
            <View className={"flex flex-row justify-start gap-4"}>
              <Image
                src={data.posterPath}
                className={"basis-[25%] rounded-lg"}
                style={{
                  aspectRatio: 2 / 3,
                }}
                resizeMode={"contain"}
              />
              <Text
                numberOfLines={6}
                ellipsizeMode="tail"
                className={
                  "body-b2 text-neutral-10-default flex-1 overflow-hidden"
                }
              >
                {data.overview}
              </Text>
            </View>
          </Bento>
          <Bento>
            <GoogleIt title={data.title} />
          </Bento>
        </View>
      </Animated.View>
    );
  },
);
DetailsContainer.displayName = "DetailsContainer";
