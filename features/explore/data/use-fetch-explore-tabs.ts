import { MediaType } from "@/features/common/data/models/media-type";
import { useQueryConfigured } from "@/features/common/data/query/hooks";
import { ExploreTabResDto } from "@/features/explore/data/dto/explore-tab.dto";

export const useFetchExploreTabs = (mediaType: MediaType) => {
  const url = `/explore/${mediaType}/tabs`;
  const { data: response, ...rest } =
    useQueryConfigured<ExploreTabResDto[]>(url);

  return {
    data: response?.data,
    ...rest,
  };
};
