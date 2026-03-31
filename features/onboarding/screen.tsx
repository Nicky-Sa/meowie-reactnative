import { View, Text } from "react-native";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useCallback, useRef, useState } from "react";
import { OnboardingItem } from "@/features/onboarding/item";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Extrapolation,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";
import { tailwind } from "@/lib/tailwind";
import { Button } from "@/features/common/ui/button";
import { NavArrowRight } from "iconoir-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useScreenDimensions } from "@/hooks/useScreenDimensions";
import { Icon } from "@/features/common/ui/icon";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";

const items = [
  {
    lottiePath:
      "https://meowie-public.s3.eu-central-1.amazonaws.com/onboarding/1.json",
    title: "Swipe to Discover",
    body: "Find movies you’ll love with a simple swipe.",
  },
  {
    lottiePath:
      "https://meowie-public.s3.eu-central-1.amazonaws.com/onboarding/2.json",
    title: "Filters",
    body: "Quickly zero in on what you want to watch.",
  },
  {
    lottiePath:
      "https://meowie-public.s3.eu-central-1.amazonaws.com/onboarding/3.json",
    title: "Saved Favorites",
    body: "Keep track of movies you don’t want to miss.",
  },
];

export const Screen = () => {
  const router = useRouter();
  const { width } = useScreenDimensions();
  const ref = useRef<ICarouselInstance>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useSharedValue<number>(0);
  const { data } = useCurrentUser();

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

  const isLastItem = currentIndex === items.length - 1;

  return (
    <View className={"h-full flex-1 justify-center"}>
      <SafeAreaView>
        <View className={"h-[90%] justify-start gap-6 py-2"}>
          <Carousel
            loop={false}
            ref={ref}
            width={width}
            vertical={false}
            snapEnabled
            pagingEnabled
            data={items}
            onProgressChange={progress}
            onSnapToItem={(index) => setCurrentIndex(index)}
            renderItem={({ index }) => <OnboardingItem {...items[index]} />}
          />

          <View
            className={"my-0.5 flex flex-row items-center justify-between px-6"}
          >
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
              iconOnly={!isLastItem}
              iconPosition={isLastItem ? "right" : undefined}
              variant={"white"}
              onPress={() => {
                if (isLastItem) {
                  AsyncStorage.setItem("onboarded", "true").then(() => {
                    if (data?.user) {
                      router.replace("/home");
                    } else {
                      router.replace("/auth/request-otp");
                    }
                  });
                } else {
                  onPressPagination(currentIndex + 1);
                }
              }}
            >
              <View
                className={
                  "flex flex-row-reverse items-center justify-center gap-2"
                }
              >
                <Icon
                  i={NavArrowRight}
                  color={tailwind.theme.textColor.neutral[1].default}
                />
                {isLastItem && (
                  <Text className={"body-b1-strong text-neutral-1-default"}>
                    {"Let's Go"}
                  </Text>
                )}
              </View>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
