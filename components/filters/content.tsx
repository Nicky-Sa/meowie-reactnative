import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import { Button } from "@/components/common/button";
import ArrowLeft from "@/assets/icons/arrow-left.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { Genres } from "@/components/filters/items/genres";
import { Languages } from "@/components/filters/items/languages";
import { YearDecades } from "@/components/filters/items/year-decades";
import Close from "@/assets/icons/close.svg";
import { useMemo } from "react";
import { useAtom } from "jotai/index";
import {
  Filters,
  filtersAtom,
  filtersQueryParamsAtom,
  initialFiltersValue,
} from "@/atoms";
import { TMDBRating } from "@/components/filters/items/tmdb-rating";
import _ from "lodash";

export const Content = () => {
  const router = useRouter();
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
    router.back();
  };

  return (
    <View className={"flex-1 bg-neutral-13-default"}>
      <SafeAreaView>
        <View className={"flex h-full flex-col justify-between p-4"}>
          <View className={"flex w-full flex-row items-center justify-between"}>
            <View className={"flex flex-row items-center justify-start gap-3"}>
              <Button
                onPress={() => {
                  throw new Error("test");
                }}
              >
                Error
              </Button>
              <Button
                onPress={handleExit}
                variant={"secondary"}
                size={"md"}
                square
              >
                <ArrowLeft />
              </Button>
              <Text className={"title-t2-strong text-neutral-10-default"}>
                Filters
              </Text>
            </View>

            {hasSelectedFilter && (
              <Button
                onPress={() => {
                  setFilters(initialFiltersValue);
                }}
                variant={"secondary"}
                size={"md"}
                iconPosition={"left"}
              >
                <View
                  className={"flex flex-row items-center justify-center gap-2"}
                >
                  <Close />
                  <Text className={"body-b1-strong text-neutral-10-default"}>
                    Clear
                  </Text>
                </View>
              </Button>
            )}
          </View>

          <View className={"flex w-full flex-col gap-8"}>
            <View className={"flex w-full flex-col gap-2"}>
              <Genres />
              <Languages />
              <YearDecades />
              <TMDBRating />
            </View>
            <Button
              variant={"primary"}
              size={"full"}
              className={"text-center"}
              onPress={handleExit}
            >
              Apply
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
