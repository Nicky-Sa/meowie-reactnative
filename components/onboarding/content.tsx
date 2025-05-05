import { View } from "react-native";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useCallback, useRef, useState } from "react";
import { OnboardingItem } from "@/components/onboarding/elements/item";
import { useContentScreenSize } from "@/components/movies/elements/hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Extrapolation,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";
import { tailwind } from "@/lib/utils";
import { Button } from "@/components/common/button";
import AltArrowRight from "@/assets/icons/alt-arrow-right.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const items = [
  {
    riveUrl:
      "https://meowie-public.s3.eu-central-1.amazonaws.com/meowie-onboaridng-3.riv",
    title: "900,000+",
    body: "Movie suggestions, trailers, and ratings — all ready for you to explore.",
    height: "75%" as const,
  },
  {
    riveUrl:
      "https://meowie-public.s3.eu-central-1.amazonaws.com/meowie-onboaridng-1.riv",
    title: "Swipe to Discover",
    body: "Find movies you’ll love with a simple swipe.",
    height: "70%" as const,
  },
  {
    riveUrl:
      "https://meowie-public.s3.eu-central-1.amazonaws.com/meowie-onboaridng-2.riv",
    title: "Smart Filters",
    body: "Quickly zero in on what you want to watch.",
    height: "70%" as const,
  },
];

export const Content = () => {
  const router = useRouter();
  const { width } = useContentScreenSize();
  const ref = useRef<ICarouselInstance>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useSharedValue<number>(0);

  const onPressPagination = useCallback(
    (index: number) => {
      ref.current?.scrollTo({
        /**
         * Calculate the difference between the current index and the target index
         * to ensure that the carousel scrolls to the nearest index
         */
        count: index - progress.value,
        animated: true,
      });
    },
    [progress.value],
  );

  const customReanimatedStyle = useCallback(
    (progress: number, index: number, length: number) => {
      let val = Math.abs(progress - index);
      if (index === 0 && progress > length - 1) {
        val = Math.abs(progress - length);
      }

      return {
        transform: [
          {
            translateY: interpolate(val, [0, 1], [0, 0], Extrapolation.CLAMP),
          },
        ],
      };
    },
    [],
  );

  return (
    <View className={"h-full flex-1 justify-center bg-neutral-13-default p-4"}>
      <SafeAreaView>
        <View className={"h-[90%] justify-start gap-6"}>
          <Carousel
            loop={false}
            ref={ref}
            width={width * 0.95}
            vertical={false}
            snapEnabled
            pagingEnabled
            data={items}
            style={{ width: "100%" }}
            onProgressChange={progress}
            onSnapToItem={(index) => setCurrentIndex(index)}
            renderItem={({ index }) => <OnboardingItem {...items[index]} />}
          />

          <View className={"flex flex-row items-center justify-between"}>
            <Pagination.Custom
              progress={progress}
              data={items}
              dotStyle={{
                borderRadius: 100,
                width: 8,
                height: 8,
                backgroundColor:
                  tailwind.theme.backgroundColor.neutral[10].default,
              }}
              activeDotStyle={{
                borderRadius: 100,
                width: 24,
                height: 8,
                overflow: "hidden",
                backgroundColor:
                  tailwind.theme.backgroundColor.neutral[1].default,
              }}
              containerStyle={{
                gap: 5,
              }}
              horizontal
              onPress={onPressPagination}
              customReanimatedStyle={customReanimatedStyle}
            />
            <Button
              size={"lg"}
              square
              variant={"primary"}
              onPress={() => {
                if (currentIndex === items.length - 1) {
                  AsyncStorage.setItem("onboarded", "true");
                  router.replace("/movies");
                } else {
                  onPressPagination(currentIndex + 1);
                }
              }}
              className={"py-0.5"}
            >
              {currentIndex === items.length - 1 ? (
                "Let's Go"
              ) : (
                <AltArrowRight color={"#000000"} />
              )}
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
