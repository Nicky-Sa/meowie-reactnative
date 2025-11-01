import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Filter } from "iconoir-react-native";
import { useRouter } from "expo-router";
import { Button } from "@/features/common/button";
import { useAtom } from "jotai";
import { Filters, filtersAtom, initialFiltersValue } from "@/atoms";
import { Chip } from "@/features/common/chip";
import { tailwind } from "@/lib/utils";
import _ from "lodash";
import Logo from "@/assets/images/logo.svg";
import LogoType from "@/assets/images/logo-type.svg";

import { Icon } from "@/features/common/icon";

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
        "absolute z-10 flex w-full flex-1 flex-row items-center justify-between px-4"
      }
      style={{
        marginTop:
          insets.top + Platform.select({ android: 10, ios: 2, default: 0 }),
      }}
    >
      <Logo />
      <LogoType />
      <View className={"relative"}>
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
      </View>
    </View>
  );
};
