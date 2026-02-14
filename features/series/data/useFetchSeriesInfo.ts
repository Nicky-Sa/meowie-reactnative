import { SeriesInfoResDto } from "@/features/series/data/dto/series.dto";
import { useSWRConfigured } from "@/features/common/data/swr/hooks";
import { ID } from "@/features/common/data/media-query";

export const useFetchSeriesInfo = (id: ID) => {
  const url = `/series/info/${id}`;
  const { data: response, ...rest } = useSWRConfigured<SeriesInfoResDto>(url);
  return {
    data: response?.data,
    ...rest,
  };
};
