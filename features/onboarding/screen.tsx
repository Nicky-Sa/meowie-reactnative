import { View } from "react-native";
import {
  Carousel,
  CarouselRef,
  Pagination,
} from "react-native-reanimated-carousel";
import { useCallback, useRef } from "react";
import { OnboardingItem } from "@/features/onboarding/item";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";
import { tailwind } from "@/lib/tailwind";
import { Button } from "@/features/common/ui/button";
import { NavArrowRight } from "iconoir-react-native";
import { appStorage } from "@/features/common/data/utils/app-storage";
import { APP_STORAGE_KEYS } from "@/features/common/data/utils/storage-keys";
import { useRouter } from "expo-router";
import { useScreenDimensions } from "@/hooks/use-screen-dimensions";
import { Icon } from "@/features/common/ui/icon";
import onboarding1Animation from "@/assets/lottie/onboarding/1.json";
import onboarding2Animation from "@/assets/lottie/onboarding/2.json";
import onboarding3Animation from "@/assets/lottie/onboarding/3.json";

const items = [
  {
    animation: onboarding1Animation,
    title: "Scroll to Discover",
    body: "Find movies you’ll love with a simple scroll.",
  },
  {
    animation: onboarding2Animation,
    title: "Filters",
    body: "Quickly zero in on what you want to watch.",
  },
  {
    animation: onboarding3Animation,
    title: "Saved Favorites",
    body: "Keep track of movies you don’t want to miss.",
  },
];

export const Screen = () => {
  const router = useRouter();
  const { width } = useScreenDimensions();
  const ref = useRef<CarouselRef>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = useCallback((index: number) => {
    ref.current?.scrollTo({ index });
  }, []);

  const onLetsGo = () => {
    appStorage.setItem(APP_STORAGE_KEYS.ONBOARDED, "true");
    router.push("/taste");
  };

  return (
    <View className={"h-full flex-1 justify-center"}>
      <SafeAreaView>
        <View className={"h-[90%] justify-start gap-6 py-2"}>
          <Carousel
            loop={false}
            ref={ref}
            style={{ width }}
            snapMode={"page"}
            data={items}
            progress={progress}
            renderItem={({ index }) => <OnboardingItem {...items[index]} />}
          />

          <View
            className={"my-0.5 flex flex-row items-center justify-between px-6"}
          >
            <Pagination
              progress={progress}
              count={items.length}
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
                backgroundColor:
                  tailwind.theme.backgroundColor.neutral[1].default,
              }}
              containerStyle={{
                gap: 5,
              }}
              onPress={onPressPagination}
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
