import { View } from "react-native";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useCallback, useRef } from "react";
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
import { appStorage } from "@/features/common/data/utils/app-storage";
import { APP_STORAGE_KEYS } from "@/features/common/data/utils/storage-keys";
import { useRouter } from "expo-router";
import { useScreenDimensions } from "@/hooks/use-screen-dimensions";
import { Icon } from "@/features/common/ui/icon";
import { useCurrentUser } from "@/features/general/data/use-current-user";

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

  const onLetsGo = () => {
    appStorage.setItem(APP_STORAGE_KEYS.ONBOARDED, "true");
    if (data?.user) {
      router.replace("/home");
    } else {
      router.replace("/auth");
    }
  };

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
              variant={"white"}
              iconPosition={"right"}
              icon={
                <Icon
                  i={NavArrowRight}
                  color={tailwind.theme.textColor.neutral[1].default}
                />
              }
              onPress={onLetsGo}
            >
              Let&#39;s Go
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
