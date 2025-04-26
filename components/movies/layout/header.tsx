import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Rive, { Alignment } from "rive-react-native";
import Filter from "@/assets/icons/filter.svg";
import { useRouter } from "expo-router";
import { Button } from "@/components/common/button";
import { useAtom } from "jotai/index";
import { Filters, filtersAtom, initialFiltersValue } from "@/atoms";
import Chip from "@/components/common/chip";
import { tailwind } from "@/lib/utils";
import _ from "lodash";

export const Header = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filters] = useAtom(filtersAtom);
  const modifiedFields = (Object.keys(filters) as (keyof Filters)[]).filter(
    (key) => !_.isEqual(filters[key], initialFiltersValue[key]),
  ).length;

  return (
    <View
      className={
        "absolute z-10 flex w-full flex-1 flex-row items-start justify-between px-4"
      }
      style={{
        marginTop: insets.top + (Platform.select({ android: 10, ios: 0 }) ?? 0),
        height: insets.top + 28,
      }}
    >
      <View className={"-mt-1 w-[144px]"}>
        <Rive
          url="https://meowie-public.s3.eu-central-1.amazonaws.com/meowie-logo.riv"
          alignment={Alignment.TopLeft}
        />
      </View>
      <View className={"relative"}>
        <Button
          onPress={() => router.push("/filters")}
          variant={"secondary"}
          size={"md"}
          square
        >
          <Filter />
        </Button>
        {modifiedFields > 0 && (
          <View className={"absolute -left-3 -top-2"}>
            <Chip
              text={modifiedFields}
              backgroundColor={tailwind.theme.backgroundColor.brand[1].default}
            />
          </View>
        )}
      </View>
    </View>
  );
};
