import { MultiSearchResults } from "@/features/search/data/models/search-result";

export type SearchReqQueryDto = {
  query: string;
};

export type MultiSearchResDto = MultiSearchResults[];
