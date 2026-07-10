import { View, Text } from "react-native";
import { Badge } from "@/features/common/ui/badge";
import { ResolvedPersonality } from "@/features/taste/data/dto/taste.dto";

// Keeps the overlaid text legible over any poster's bright regions.
const textShadow = {
  textShadowColor: "rgba(0,0,0,0.6)",
  textShadowRadius: 8,
  textShadowOffset: { width: 0, height: 1 },
} as const;

type Props = {
  personality: ResolvedPersonality;
};

export const PersonalityHeadline = ({ personality }: Props) => (
  <View className={"absolute inset-x-0 top-12 items-center gap-3 px-6"}>
    <Text className={"body-b2 text-neutral-8-default"}>
      {personality.isOmnivore ? "Your type" : "You watch like"}
    </Text>
    <Text
      className={"title-t1-strong text-center text-neutral-8-default"}
      style={textShadow}
    >
      {personality.name}
    </Text>
    {!personality.isOmnivore && personality.source ? (
      <Text className={"body-b2 -mt-2 text-neutral-8-default"}>
        {personality.source}
      </Text>
    ) : null}
    <Text
      className={"body-b1 px-4 text-center text-neutral-8-default"}
      style={textShadow}
    >
      {personality.description}
    </Text>
    <Badge
      text={
        personality.isOmnivore
          ? "A rare mix"
          : `Only ${personality.rarityPercent}% of watchers`
      }
      variant={"primary"}
    />
  </View>
);
