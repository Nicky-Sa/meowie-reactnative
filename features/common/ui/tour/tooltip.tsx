import { View, Text } from "react-native";
import { RenderProps } from "react-native-spotlight-tour";
import { Button } from "@/features/common/ui/button";
import { NavArrowLeft } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";

type Props = RenderProps & { text: string; total: number };

export const TourTooltip = ({
  current,
  isFirst,
  isLast,
  next,
  previous,
  stop,
  text,
  total,
}: Props) => {
  return (
    <View className="w-[250px] gap-4 rounded-2xl bg-neutral-15-default p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Text className="body-b1 text-neutral-5-default">
          {current + 1} / {total}
        </Text>
        <Button onPress={stop} variant={"link"} size={"md"}>
          Skip
        </Button>
      </View>

      {/* Content */}
      <View>
        <Text className="body-b1 text-neutral-10-default">{text}</Text>
      </View>

      {/* Footer */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-2">
          {!isFirst ? (
            <Button
              onPress={previous}
              variant={"black"}
              iconPosition={"only"}
              size={"md"}
              icon={<Icon i={NavArrowLeft} />}
            />
          ) : (
            <View />
          )}
        </View>

        <Button onPress={isLast ? stop : next} variant={"primary"} size={"md"}>
          {isLast ? "Let's Go!" : "Next Step"}
        </Button>
      </View>
    </View>
  );
};
