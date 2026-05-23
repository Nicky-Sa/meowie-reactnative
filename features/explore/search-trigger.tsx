import { View, Text } from "react-native";
import { Search } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import { Link } from "@/features/common/ui/link";

export const SearchTrigger = () => {
  return (
    <Link href="/search">
      <View
        className={
          "flex flex-row items-center gap-2 rounded-xl border border-neutral-4-default bg-neutral-15-default/70 pl-3 pr-2"
        }
      >
        <Icon i={Search} />
        <Text className={"body-b1-text-input py-3 text-neutral-3-default"}>
          Search anything...
        </Text>
      </View>
    </Link>
  );
};
