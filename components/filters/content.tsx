import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import { Button } from "@/components/common/button";
import ArrowLeft from "@/assets/icons/arrow-left.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { Genres } from "@/components/filters/items/genres";
import { Languages } from "@/components/filters/items/languages";
import { YearDecades } from "@/components/filters/items/year-decades";
import Close from "@/assets/icons/close.svg";
import React, { useMemo } from "react";
import { useAtom } from "jotai/index";
import { filtersAtom, initialFiltersValue } from "@/atoms";
import { objectHasSomeValues } from "@/lib/utils";
import { Slider } from "@/components/filters/elements/slider";
import { TMDBRating } from "@/components/filters/items/tmdb-rating";

export const Content = () => {
  const router = useRouter();
  const [filters, setFilters] = useAtom(filtersAtom);
  const filterApplied = useMemo(() => objectHasSomeValues(filters), [filters]);

  return (
    <View className={"flex-1 bg-neutral-13-default"}>
      <SafeAreaView>
        <View className={"flex h-full flex-col justify-between p-4"}>
          <View className={"flex w-full flex-row items-center justify-between"}>
            <View className={"flex flex-row items-center justify-start gap-3"}>
              <Button
                onPress={router.back}
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

            {filterApplied && (
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

          <View className={"flex w-full flex-col gap-2"}>
            <Genres />
            <Languages />
            <YearDecades />
            <TMDBRating />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
