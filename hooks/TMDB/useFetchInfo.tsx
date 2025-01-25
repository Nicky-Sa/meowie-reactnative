import { formatDuration } from "@/lib/utils";
import {
  APIInfo as TMDB_APIInfo,
  RequiredInfo as TMDB_RequiredInfo,
} from "@/models/tmdb/info";
import {
  APIInfo as OMDB_APIInfo,
  RequiredInfo as OMDB_RequiredInfo,
} from "@/models/omdb/info";
import useSWR, { Fetcher } from "swr";

export const useFetchInfo = (id: number) => {
  let data: (TMDB_RequiredInfo & OMDB_RequiredInfo) | undefined = undefined;
  let error: any;
  let isLoading: boolean;

  // TODO: fix apiKey place

  // TMDB API
  const tmdbFetcher: Fetcher<TMDB_APIInfo> = (url: string) =>
    fetch(url).then((r) => r.json());
  const tmdbApiKey = "REDACTED";
  const tmdbUrl = `https://api.themoviedb.org/3/movie/${id}?append_to_response=videos,keywords,release_dates&language=en-US&api_key=${tmdbApiKey}`;
  const tmdbResult = useSWR(tmdbUrl, tmdbFetcher);

  // OMDB API
  const omdbFetcher: Fetcher<OMDB_APIInfo> = (url: string) =>
    fetch(url).then((r) => r.json());
  const omdbApiKey = "f8a03255";
  const imdbId = tmdbResult.data?.imdb_id;
  const omdbUrl = imdbId
    ? `http://www.omdbapi.com/?i=${imdbId}&apikey=${omdbApiKey}`
    : null; // pass null to useSWR to prevent fetch if imdbId is not available
  // const omdbResult = useSWR(omdbUrl, omdbFetcher);
  const omdbResult = {
    data: {
      Plot: "blody blody boo",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BNWE5MGI3MDctMmU5Ni00YzI2LWEzMTQtZGIyZDA5MzQzNDBhXkEyXkFqcGc@._V1_SX300.jpg",
      Rated: "N/A",
      Ratings: [
        {
          Source: "Internet Movie Database",
          Value: "7.6/10",
        },
        {
          Source: "Rotten Tomatoes",
          Value: "85%",
        },
        {
          Source: "Metacritic",
          Value: "67/100",
        },
      ],
    },
    isLoading: false,
    error: null,
  };

  if (tmdbResult.data) {
    data = {
      // tmdb
      title: tmdbResult.data.title || "No Title Found",
      publishYear: new Date(tmdbResult.data.release_date ?? 0)
        .getFullYear()
        .toString(),
      overview: tmdbResult.data.overview || omdbResult.data?.Plot || "",
      posterPath:
        `https://image.tmdb.org/t/p/original${tmdbResult.data.poster_path}` ||
        omdbResult.data?.Poster ||
        "",
      duration: formatDuration(tmdbResult.data.runtime),
      certification:
        (tmdbResult.data.release_dates.results.find(
          (result) => result.iso_3166_1 === "US",
        )?.release_dates[0].certification ||
          omdbResult.data?.Rated) ??
        "N/A",
      trailerKey:
        tmdbResult.data.videos.results.find(
          (result) =>
            result.type === "Trailer" &&
            result.official &&
            result.site === "YouTube",
        )?.key ?? "",
      keywords: tmdbResult.data.keywords.keywords.map(
        (keyword) => keyword.name,
      ),
      // omdb
      ratings:
        omdbResult.data?.Ratings.map((rating) => ({
          source: rating.Source,
          value: rating.Value,
        })) ?? [],
    };

    isLoading = tmdbResult.isLoading || omdbResult.isLoading;
    error = { tmdb: tmdbResult.error, omdb: omdbResult.error };

    return {
      isLoading,
      error,
      data,
    };
  }

  return {
    isLoading: tmdbResult.isLoading,
    error: { tmdb: tmdbResult.error },
    data,
  };
};
