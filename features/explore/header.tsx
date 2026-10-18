import { ComponentProps, PropsWithChildren } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Filter, Search } from "iconoir-react-native";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { SlidingToggle } from "@/features/common/ui/sliding-toggle";
import { MediaType } from "@/features/common/data/models/media-type";

const mediaTypes = ["Movies", "Series"];

type Props = PropsWithChildren<{
  mediaType: MediaType;
  onMediaTypeChange: (label: string) => void;
  onFilterPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
  style: ComponentProps<typeof Animated.View>["style"];
}>;

export const Header = ({
  mediaType,
  onMediaTypeChange,
  onFilterPress,
  onLayout,
  style,
  children,
}: Props) => {
  const router = useRouter();

  return (
    <Animated.View style={style} onLayout={onLayout}>
      <SafeAreaView edges={["top"]} className="gap-4 px-4 pt-2">
        <View className="flex w-full flex-row items-center justify-between gap-2">
          <Button
            onPress={onFilterPress}
            variant="ghost"
            size="md"
            iconPosition="only"
            icon={<Icon i={Filter} />}
          />
          <SlidingToggle
            containerClassName="h-14 w-44"
            items={mediaTypes}
            activeItem={mediaType === "movie" ? "Movies" : "Series"}
            setActiveItem={onMediaTypeChange}
          />
          <Button
            onPress={() => router.push("/search")}
            accessibilityLabel="Search"
            variant="ghost"
            size="md"
            iconPosition="only"
            icon={<Icon i={Search} />}
          />
        </View>
        {children}
      </SafeAreaView>
    </Animated.View>
  );
};
