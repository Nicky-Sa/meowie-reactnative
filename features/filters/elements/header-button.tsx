import { Button } from "@/features/common/button";
import { Icon } from "@/features/common/icon";
import { Filter } from "iconoir-react-native";
import { View } from "react-native";
import { Chip } from "@/features/common/chip";
import { tailwind } from "@/lib/tailwind";
import { useRouter } from "expo-router";
import { useAtom } from "jotai/index";
import { Filters, filtersAtom, initialFiltersValue } from "@/atoms";
import _ from "lodash";

export const FiltersHeaderButton = () => {
  const router = useRouter();
  const [filters] = useAtom(filtersAtom);
  const modifiedFields = (Object.keys(filters) as (keyof Filters)[]).filter(
    (key) => !_.isEqual(filters[key], initialFiltersValue[key]),
  ).length;
  return (
    <>
      <Button
        onPress={() => router.push("/filters")}
        variant={"ghost"}
        size={"md"}
        iconOnly
      >
        <Icon i={Filter} />
      </Button>
      {modifiedFields > 0 && (
        <View className={"absolute -left-1 -top-1"}>
          <Chip
            text={modifiedFields}
            backgroundColor={tailwind.theme.backgroundColor.brand[1].default}
          />
        </View>
      )}
    </>
  );
};
