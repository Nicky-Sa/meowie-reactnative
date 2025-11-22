import { View, Text } from "react-native";
import { Button } from "@/features/common/button";
import { Erase } from "iconoir-react-native";
import { Genres } from "@/features/filters/items/genres";
import { Languages } from "@/features/filters/items/languages";
import { YearDecades } from "@/features/filters/items/year-decades";
import { useMemo } from "react";
import { useAtom } from "jotai";
import {
  Filters,
  filtersAtom,
  filtersQueryParamsAtom,
  initialFiltersValue,
} from "@/atoms";
import { TMDBRating } from "@/features/filters/items/tmdb-rating";
import _ from "lodash";
import { Icon } from "@/features/common/icon";
import { InnerScreen } from "@/features/common/layout/inner-screen";

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

export const Content = () => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const [, setFiltersQueryParams] = useAtom(filtersQueryParamsAtom);

  const hasSelectedFilter = useMemo(
    () => !_.isEqual(filters, initialFiltersValue),
    [filters],
  );

  const handleExit = () => {
    setFiltersQueryParams(
      `${Object.entries(filters)
        .filter(
          ([key, value]) =>
            !_.isEqual(value, initialFiltersValue[key as keyof Filters]),
        )
        .map(([key, value]) => `${key}=${value.toString()}`)
        .join("&")}`,
    );
  };

  return (
    <InnerScreen
      title={"Filters"}
      onBack={handleExit}
      rightTopComponent={
        hasSelectedFilter && (
          <ClearSelection
            onPress={() => {
              setFilters(initialFiltersValue);
            }}
          />
        )
      }
    >
      <View className={"flex w-full flex-col gap-8"}>
        <View className={"flex w-full flex-col gap-2"}>
          <Genres />
          <Languages />
          <YearDecades />
          <TMDBRating />
        </View>
        <Button variant={"white"} size={"lg"} onPress={handleExit}>
          Apply
        </Button>
      </View>
    </InnerScreen>
  );
};
