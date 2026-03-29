import { Genres } from "@/features/filters/items/genres";
import { Languages } from "@/features/filters/items/languages";
import { Decades } from "@/features/filters/items/decades";
import { TMDBRating } from "@/features/filters/items/tmdb-rating";
import { Formats } from "@/features/filters/items/formats";
import { View } from "react-native";
import { useAtom } from "jotai";
import { tvFiltersAtom } from "@/atoms";
import { initialSeriesFiltersValue } from "@/features/common/data/media-query";
import _ from "lodash";
import { useGenres } from "@/features/general/data/constants/useGenres";

export const SeriesFiltersContent = () => {
  const [filters, setFilters] = useAtom(tvFiltersAtom);
  const { data: genresData } = useGenres();

  return (
    <View className="flex flex-col gap-2">
      <Genres
        genres={genresData?.seriesGenres || []}
        value={filters.genres}
        isClearable={
          !_.isEqual(filters.genres, initialSeriesFiltersValue.genres)
        }
        onApply={(v) =>
          setFilters((draft) => {
            draft.genres = v;
          })
        }
        onClear={() =>
          setFilters((draft) => {
            draft.genres = initialSeriesFiltersValue.genres;
          })
        }
      />
      <Formats
        value={filters.format}
        isClearable={filters.format !== initialSeriesFiltersValue.format}
        onApply={(v) =>
          setFilters((draft) => {
            draft.format = v;
          })
        }
        onClear={() =>
          setFilters((draft) => {
            draft.format = initialSeriesFiltersValue.format;
          })
        }
      />
      <Languages
        value={filters.languages}
        isClearable={
          !_.isEqual(filters.languages, initialSeriesFiltersValue.languages)
        }
        onApply={(v) =>
          setFilters((draft) => {
            draft.languages = v;
          })
        }
        onClear={() =>
          setFilters((draft) => {
            draft.languages = initialSeriesFiltersValue.languages;
          })
        }
      />
      <Decades
        value={filters.decade}
        isClearable={filters.decade !== initialSeriesFiltersValue.decade}
        onApply={(v) =>
          setFilters((draft) => {
            draft.decade = v;
          })
        }
        onClear={() =>
          setFilters((draft) => {
            draft.decade = initialSeriesFiltersValue.decade;
          })
        }
      />
      <TMDBRating
        value={filters.tmdbRatings}
        isClearable={
          !_.isEqual(filters.tmdbRatings, initialSeriesFiltersValue.tmdbRatings)
        }
        onApply={(v) =>
          setFilters((draft) => {
            draft.tmdbRatings = v;
          })
        }
        onClear={() =>
          setFilters((draft) => {
            draft.tmdbRatings = initialSeriesFiltersValue.tmdbRatings;
          })
        }
      />
    </View>
  );
};
