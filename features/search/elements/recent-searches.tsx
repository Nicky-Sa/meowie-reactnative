import { Pressable, Text, View } from "react-native";
import { Xmark } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import { tailwind } from "@/lib/tailwind";
import { SearchResultCard } from "@/features/search/elements/card";
import { useRecentSearches } from "@/features/search/data/use-recent-searches";

export const RecentSearches = () => {
  const { recentSearches, add, remove } = useRecentSearches();

  if (recentSearches.length === 0) return null;

  return (
    <View className="flex flex-col gap-4">
      <Text className="body-b1-strong text-neutral-10-default">Recent</Text>
      {recentSearches.map((item) => (
        <View
          key={`${item.mediaType}-${item.id}`}
          className="flex flex-row items-center gap-2"
        >
          <View className="flex-1">
            <SearchResultCard item={item} onPress={() => add(item)} />
          </View>
          <Pressable onPress={() => remove(item)} hitSlop={12}>
            <Icon
              i={Xmark}
              color={tailwind.theme.textColor.neutral[5].default}
            />
          </Pressable>
        </View>
      ))}
    </View>
  );
};
