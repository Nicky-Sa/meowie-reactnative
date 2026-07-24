import { memo } from "react";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { tailwind } from "@/lib/tailwind";
import { PosterCard } from "@/features/common/posters/poster-card";
import { Title } from "@/features/taste/data/dto/journey.dto";

type Props = {
  item: Title;
  width: number;
  selected: boolean;
  onToggle: (tmdbId: number) => void;
};

export const PosterTile = memo(({ item, width, selected, onToggle }: Props) => {
  return (
    <Pressable
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle(item.tmdbId);
      }}
      accessibilityRole={"checkbox"}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${item.title}, ${item.year}`}
      style={{ width }}
    >
      <PosterCard
        posterUri={item.poster}
        width={width}
        borderWidth={2}
        borderColor={
          selected
            ? tailwind.theme.backgroundColor.brand[1].default
            : tailwind.theme.borderColor.neutral[3].default
        }
        showDetails
        title={item.title}
      />
    </Pressable>
  );
});

PosterTile.displayName = "PosterTile";
