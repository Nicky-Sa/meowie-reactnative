import { Genres } from "@/features/filters/items/genres";
import { Languages } from "@/features/filters/items/languages";
import { Decades } from "@/features/filters/items/decades";
import { TMDBRating } from "@/features/filters/items/tmdb-rating";
import { View } from "react-native";
import { useAtom } from "jotai";
import { movieFiltersAtom } from "@/atoms";
import { initialMovieFiltersValue } from "@/features/common/data/media-query";
import _ from "lodash";
import { useGenres } from "@/features/general/data/constants/useGenres";

export const MovieFiltersContent = () => {
  const [filters, setFilters] = useAtom(movieFiltersAtom);
  const { data: genresData } = useGenres();

  return (
    <View className="flex flex-col gap-2">
      <Genres
        genres={genresData?.movieGenres || []}
        value={filters.genres}
        isClearable={
          !_.isEqual(filters.genres, initialMovieFiltersValue.genres)
        }
        onApply={(v) =>
          setFilters((draft) => {
            draft.genres = v;
          })
        }
        onClear={() =>
          setFilters((draft) => {
            draft.genres = initialMovieFiltersValue.genres;
          })
        }
      />
      <Languages
        value={filters.languages}
        isClearable={
          !_.isEqual(filters.languages, initialMovieFiltersValue.languages)
        }
        onApply={(v) =>
          setFilters((draft) => {
            draft.languages = v;
          })
        }
        onClear={() =>
          setFilters((draft) => {
            draft.languages = initialMovieFiltersValue.languages;
          })
        }
      />
      <Decades
        value={filters.decade}
        isClearable={filters.decade !== initialMovieFiltersValue.decade}
        onApply={(v) =>
          setFilters((draft) => {
            draft.decade = v;
          })
        }
        onClear={() =>
          setFilters((draft) => {
            draft.decade = initialMovieFiltersValue.decade;
          })
        }
      />
      <TMDBRating
        value={filters.tmdbRatings}
        isClearable={
          !_.isEqual(filters.tmdbRatings, initialMovieFiltersValue.tmdbRatings)
        }
        onApply={(v) =>
          setFilters((draft) => {
            draft.tmdbRatings = v;
          })
        }
        onClear={() =>
          setFilters((draft) => {
            draft.tmdbRatings = initialMovieFiltersValue.tmdbRatings;
          })
        }
      />
    </View>
  );
};
