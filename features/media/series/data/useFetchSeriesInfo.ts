import { SeriesInfoResDto } from "@/features/media/series/data/dto/series.dto";
import { useQueryConfigured } from "@/features/common/data/query/hooks";
import { ID } from "@/features/common/data/media-query";

export const useFetchSeriesInfo = (id: ID) => {
  const url = `/series/info/${id}`;
  const { data: response, ...rest } = useQueryConfigured<SeriesInfoResDto>(url);
  return {
    data: response?.data,
    ...rest,
  };
};
