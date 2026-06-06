import { useQueryConfigured } from "@/features/common/data/query/hooks";
import {
  MultiSearchResDto,
  SearchReqQueryDto,
} from "@/features/search/data/dto/search.dto";

type Args = SearchReqQueryDto;

export const useMultiSearchQuery = ({ query }: Args) => {
  const url = `/search/multi?query=${encodeURIComponent(query)}`;
  const { data: response, ...rest } =
    useQueryConfigured<MultiSearchResDto>(url);

  return {
    data: response?.data,
    ...rest,
  };
};
