import { useSWRConfigured } from "@/features/common/data/swr-config";
import {
  MultiSearchResDto,
  SearchReqQueryDto,
} from "@/features/search/data/dto/search.dto";

type Args = SearchReqQueryDto;

export const useMultiSearchQuery = ({ query }: Args) => {
  const url = `/search/multi?query=${encodeURIComponent(query)}`;
  const { data: response, ...rest } = useSWRConfigured<MultiSearchResDto>(url);

  return {
    data: response?.data,
    ...rest,
  };
};
