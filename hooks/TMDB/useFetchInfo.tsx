import { formatDuration } from "@/lib/utils";
import { APIInfo, RequiredInfo } from "@/models/info";
import useSWR, { Fetcher } from "swr";

export const useFetchInfo = (id: number) => {
  // TODO: fix apiKey place
  const apiKey = "REDACTED";
  const url = `https://api.themoviedb.org/3/movie/${id}?append_to_response=videos,keywords,release_dates&language=en-US&api_key=${apiKey}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };
  const fetcher: Fetcher<APIInfo> = (url: string) =>
    fetch(url).then((r) => r.json());

  const { isLoading, data, error } = useSWR(url, fetcher);

  if (data) {
    const requiredInfo: RequiredInfo = {
      title: data.title || "No Title Found",
      publish_year: new Date(data.release_date ?? 0).getFullYear().toString(),
      duration: formatDuration(data.runtime),
      certification:
        data.release_dates.results.find((result) => result.iso_3166_1 === "US")
          ?.release_dates[0].certification ?? "N/A",
      trailerKey: data.videos.results.find((result) => result.type === "Trailer" && result.official && result.site === "YouTube")?.key ?? "",
    };
    return { isLoading, data: requiredInfo, error };
  }
  return { isLoading, data: undefined, error };
};
