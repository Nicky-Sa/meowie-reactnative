import { View } from "react-native";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useCallback, useRef } from "react";
import {
  Extrapolation,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";
import { tailwind } from "@/lib/tailwind";
import { useScreenDimensions } from "@/hooks/useScreenDimensions";
import { onboardingData } from "@/features/auth/components/onboarding/data";
import { OnboardingItem } from "@/features/auth/components/onboarding/item";

export const OnboardingCarousel = () => {
  const { width } = useScreenDimensions();
  const ref = useRef<ICarouselInstance>(null);
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
    <View className="w-full flex-1 items-center justify-center">
      <View className="flex aspect-square w-full flex-col items-center gap-4">
        <Carousel
          loop
          ref={ref}
          width={width}
          vertical={false}
          snapEnabled
          pagingEnabled
          data={onboardingData}
          onProgressChange={progress}
          renderItem={({ index }) => (
            <OnboardingItem {...onboardingData[index]} />
          )}
        />

        <View>
          <Pagination.Custom
            progress={progress}
            data={onboardingData}
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
        </View>
      </View>
    </View>
  );
};
