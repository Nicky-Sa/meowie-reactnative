import { ComponentProps, PropsWithChildren } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Filter, Search } from "iconoir-react-native";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { SlidingToggle } from "@/features/common/ui/sliding-toggle";
import {
  MEDIA_TYPES,
  MediaType,
} from "@/features/common/data/models/media-type";

const mediaTypeLabels = MEDIA_TYPES.map((type) => type.label);

type Props = PropsWithChildren<{
  mediaType: MediaType;
  onMediaTypeChange: (mediaType: MediaType) => void;
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
  const activeLabel = MEDIA_TYPES.find(
    (type) => type.value === mediaType,
  )?.label;

  const onLabelChange = (label: string) => {
    const selected = MEDIA_TYPES.find((type) => type.label === label);
    if (selected) onMediaTypeChange(selected.value);
  };

  return (
    <Animated.View style={style} onLayout={onLayout}>
      <SafeAreaView edges={["top"]} className="gap-4 px-4">
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
            items={mediaTypeLabels}
            activeItem={activeLabel ?? mediaTypeLabels[0]}
            setActiveItem={onLabelChange}
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
