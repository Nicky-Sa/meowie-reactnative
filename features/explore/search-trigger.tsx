import { Pressable, Text } from "react-native";
import { Search } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import { useRouter } from "expo-router";

export const SearchTrigger = () => {
  const router = useRouter();
  return (
    <Pressable
      className={
        "flex flex-row items-center gap-2 rounded-xl border border-neutral-4-default bg-neutral-15-default/70 py-3 pl-3 pr-2"
      }
      onPress={() => router.push("/search")}
    >
      <Icon i={Search} />
      <Text className={"body-b1-text-input h-6 pt-0.5 text-neutral-3-default"}>
        Search movie, actor, genre
      </Text>
    </Pressable>
  );
};
