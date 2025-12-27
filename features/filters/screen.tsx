import { View, Text } from "react-native";
import { Button } from "@/features/common/button";
import { Erase } from "iconoir-react-native";
import { Genres } from "@/features/filters/items/genres";
import { Languages } from "@/features/filters/items/languages";
import { YearDecades } from "@/features/filters/items/year-decades";
import { useMemo } from "react";
import { useAtom } from "jotai";
import { Filters, initialFiltersValue } from "@/features/common/data/query";
import { TMDBRating } from "@/features/filters/items/tmdb-rating";
import _ from "lodash";
import { Icon } from "@/features/common/icon";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useRouter } from "expo-router";
import { filtersAtom } from "@/atoms";

const ClearSelection = ({ onPress }: { onPress: () => void }) => {
  return (
    <Button
      onPress={onPress}
      variant={"ghost"}
      size={"md"}
      iconPosition={"left"}
    >
      <View className={"flex flex-row items-center justify-center gap-2"}>
        <Icon i={Erase} />

        <Text className={"body-b1-strong text-neutral-10-default"}>Clear</Text>
      </View>
    </Button>
  );
};

export const Screen = () => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const router = useRouter();

  const modifiedFieldsNumber = useMemo(
    () =>
      (Object.keys(filters) as (keyof Filters)[]).filter(
        (key) => !_.isEqual(filters[key], initialFiltersValue[key]),
      ).length,
    [filters],
  );

  const hasSelectedFilter = modifiedFieldsNumber > 0;

  const clearFilters = () => {
    setFilters(initialFiltersValue);
  };

  const onExit = () => {
    clearFilters();
    router.back();
  };

  const handleApply = () => {
    router.push({
      pathname: "/filters/posters-list",
      params: { ...filters, modifiedFieldsNumber },
    });
  };

  return (
    <InnerScreen
      title={"Filters"}
      onBack={onExit}
      rightTopComponent={
        hasSelectedFilter && <ClearSelection onPress={clearFilters} />
      }
    >
      <View className={"flex w-full flex-col gap-8"}>
        <View className={"flex w-full flex-col gap-2"}>
          <Genres />
          <Languages />
          <YearDecades />
          <TMDBRating />
        </View>
        <Button
          variant={"white"}
          size={"lg"}
          disabled={!hasSelectedFilter}
          onPress={handleApply}
        >
          Apply
        </Button>
      </View>
    </InnerScreen>
  );
};
