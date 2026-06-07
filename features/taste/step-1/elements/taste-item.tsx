import { Checkbox } from "@/features/common/ui/check-box";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeInUp,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";
import { useMemo, useState } from "react";
import { Keyword } from "@/features/taste/step-1/genre-data";
import { Segment } from "@/features/common/ui/segment";
import { Updater } from "use-immer";

type Props = {
  name: string;
  emoji: string;
  keywords: Keyword[];
  taste: string[];
  setTaste: Updater<string[]>;
};

export const TasteItem = ({
  name,
  emoji,
  keywords,
  taste,
  setTaste,
}: Props) => {
  const allKeywordIds = useMemo(() => keywords.map((k) => k.id), [keywords]);

  const [expanded, setExpanded] = useState(false);

  // 1. Calculate selection directly from the global 'taste' array
  const selectedCountForGenre = allKeywordIds.filter((id) =>
    taste.includes(id),
  ).length;

  const isPartial =
    selectedCountForGenre > 0 && selectedCountForGenre < allKeywordIds.length;
  const noSelection = selectedCountForGenre === 0;

  const checkboxState = noSelection
    ? "unchecked"
    : isPartial
      ? "indeterminate"
      : "checked";

  const onExpand = () => {
    // 1. Calculate the new state outside the setter
    const shouldExpand = !expanded;

    // 2. Call the global setter
    setTaste((draft) => {
      if (shouldExpand) {
        // Add all missing keywords for this genre
        allKeywordIds.forEach((id) => {
          if (!draft.includes(id)) draft.push(id);
        });
      } else {
        // Remove all keywords for this genre
        return draft.filter((id) => !allKeywordIds.includes(id));
      }
    });

    // 3. Call the local setter
    setExpanded(shouldExpand);
  };

  return (
    <View className={"flex flex-col gap-2 p-6"}>
      <Pressable
        className={"flex flex-row items-center justify-between"}
        onPress={onExpand}
        hitSlop={30}
      >
        <Text className={"body-b1-strong text-neutral-10-default"}>
          {emoji} {name}
        </Text>
        <Checkbox state={checkboxState} onPress={onExpand} />
      </Pressable>
      {expanded && (
        <Animated.View
          entering={FadeInUp.duration(300).springify()}
          exiting={FadeOutUp.duration(200)}
          layout={LinearTransition}
          className={"flex flex-col gap-4"}
        >
          <Text className={"body-b1 text-neutral-5-default"}>
            If you don&#39;t like all types of {name.toLowerCase()}, deselect
            the items from the list below.
          </Text>
          <View className={"flex flex-row flex-wrap gap-2"}>
            {keywords.map((item) => (
              <Segment
                key={item.id}
                item={item}
                currentValues={taste}
                setCurrentValues={setTaste}
                multiple
              />
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
};
