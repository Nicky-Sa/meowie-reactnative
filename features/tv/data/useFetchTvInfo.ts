import { TvInfoResDto } from "@/features/tv/data/dto/tv.dto";
import { useSWRConfigured } from "@/features/common/data/swr/hooks";
import { ID } from "@/features/common/data/media-query";

export const useFetchTvInfo = (id: ID) => {
  const url = `/tv/info/${id}`;
  const { data: response, ...rest } = useSWRConfigured<TvInfoResDto>(url);
  return {
    data: response?.data,
    ...rest,
  };
};
