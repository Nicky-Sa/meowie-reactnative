import { View, Text } from "react-native";
import { Button } from "@/features/common/ui/button";
import { Erase } from "iconoir-react-native";
import { MediaGenres } from "@/features/filters/items/media-genres";
import { Languages } from "@/features/filters/items/languages";
import { YearDecades } from "@/features/filters/items/year-decades";
import { useMemo } from "react";
import { useAtom } from "jotai";
import {
  Filters,
  initialFiltersValue,
} from "@/features/common/data/media-query";
import { TMDBRating } from "@/features/filters/items/tmdb-rating";
import _ from "lodash";
import { Icon } from "@/features/common/ui/icon";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useRouter } from "expo-router";
import { filtersAtom, filtersMediaTypeAtom } from "@/atoms";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";
import { SlidingToggle } from "@/features/common/ui/sliding-toggle";
import {
  MediaType,
  MEDIA_TYPES,
} from "@/features/common/data/models/media-type";

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
  const [mediaType, setMediaType] = useAtom(filtersMediaTypeAtom);
  const router = useRouter();
  const { capture } = useCaptureEvent();

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

  const handleApply = () => {
    capture("filters_applied", { filters, mediaType });
    router.push({
      pathname: "/discover/posters",
      params: {
        ...filters,
        modifiedFieldsNumber,
        mediaType,
        title: `Filtered ${mediaType === "movie" ? "Movies" : "TV Shows"}`,
      },
    });
  };

  return (
    <InnerScreen
      title={"Filter"}
      rightTopComponent={
        hasSelectedFilter && <ClearSelection onPress={clearFilters} />
      }
    >
      <View className={"flex w-full flex-col gap-8"}>
        <View className={"flex w-full flex-col gap-2"}>
          <View className="flex items-center justify-center">
            <SlidingToggle
              containerClassName="w-full rounded-xl h-[56px]"
              tabClassName="rounded-lg"
              items={MEDIA_TYPES.map((t) => t.label)}
              activeItem={
                MEDIA_TYPES.find((t) => t.value === mediaType)?.label || "Movie"
              }
              setActiveItem={(label) => {
                const newType =
                  MEDIA_TYPES.find((t) => t.label === label)?.value || "movie";
                if (newType !== mediaType) {
                  setMediaType(newType as MediaType);
                }
              }}
            />
          </View>
          <MediaGenres mediaType={mediaType} />
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
