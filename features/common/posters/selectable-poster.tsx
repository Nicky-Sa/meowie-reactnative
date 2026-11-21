import { memo } from "react";
import { Pressable } from "react-native";
import { PlainPoster } from "@/features/common/posters/plain-poster";
import { tailwind } from "@/lib/tailwind";

type Props = {
  posterUri: string;
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
};

export const SelectablePoster = memo(
  ({ posterUri, title, subtitle, selected, onPress }: Props) => (
    <Pressable
      testID="selectable-poster"
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
    >
      {({ pressed }) => (
        <PlainPoster
          posterUri={posterUri}
          recyclingKey={posterUri}
          title={title}
          subtitle={subtitle}
          borderColor={tailwind.theme.borderColor.neutral[2].default}
          borderWidth={1}
          pressed={pressed}
          selected={selected}
        />
      )}
    </Pressable>
  ),
);

SelectablePoster.displayName = "SelectablePoster";
