import { View } from "react-native";
import { Button } from "@/features/common/ui/button";
import { useMemo } from "react";
import { useAtom } from "jotai";
import {
  initialMovieFiltersValue,
  initialSeriesFiltersValue,
} from "@/features/common/data/media-query";
import _ from "lodash";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useRouter } from "expo-router";
import { filtersMediaTypeAtom, movieFiltersAtom, tvFiltersAtom } from "@/atoms";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { SlidingToggle } from "@/features/common/ui/sliding-toggle";
import {
  MediaType,
  MEDIA_TYPES,
} from "@/features/common/data/models/media-type";
import { SlidingContent } from "@/features/common/ui/sliding-content";
import { ClearSelection } from "@/features/filters/clear-selection";
import { SeriesFiltersContent } from "@/features/filters/series-filters";
import { MovieFiltersContent } from "@/features/filters/movie-filters";

export const Screen = () => {
  const [movieFilters, setMovieFilters] = useAtom(movieFiltersAtom);
  const [seriesFilters, setSeriesFilters] = useAtom(tvFiltersAtom);
  const [mediaType, setMediaType] = useAtom(filtersMediaTypeAtom);
  const router = useRouter();
  const { filters } = useAnalytics();

  const selectedFilters = mediaType === "movie" ? movieFilters : seriesFilters;

  const initialValue =
    mediaType === "movie"
      ? initialMovieFiltersValue
      : initialSeriesFiltersValue;

  const modifiedFieldsNumber = useMemo(
    () =>
      (Object.keys(selectedFilters) as (keyof typeof initialValue)[]).filter(
        (key) => !_.isEqual(selectedFilters[key], initialValue[key]),
      ).length,
    [selectedFilters, initialValue],
  );

  const hasSelectedFilter = modifiedFieldsNumber > 0;

  const clearFilters = () => {
    if (mediaType === "movie") {
      setMovieFilters(initialMovieFiltersValue);
    } else {
      setSeriesFilters(initialSeriesFiltersValue);
    }
  };

  const handleApply = () => {
    filters.trackFiltersApplied({ filters: selectedFilters, mediaType });
    // dismissTo: so the user feels like the filters are applies in-place, instead of feeling being navigated to a new screen
    router.dismissTo({
      pathname: "/discover/posters",
      params: {
        title: `Filtered ${mediaType === "movie" ? "Movies" : "Series"}`,
        endpoint: `${mediaType}/posters`,
        ...selectedFilters,
        modifiedFieldsNumber,
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
          <SlidingToggle
            containerClassName="w-full rounded-xl h-14"
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

          <View className="w-full">
            <SlidingContent
              isActive={mediaType === "movie"}
              slideDirection="left"
            >
              <MovieFiltersContent />
            </SlidingContent>

            <SlidingContent
              isActive={mediaType === "series"}
              slideDirection="right"
            >
              <SeriesFiltersContent />
            </SlidingContent>
          </View>
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
