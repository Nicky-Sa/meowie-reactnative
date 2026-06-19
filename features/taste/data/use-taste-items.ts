import { useQueryConfigured } from "@/features/common/data/query/hooks";
import { Genre } from "@/features/general/data/constants/use-genres";

export type TasteGenre = Genre & {
  mediaType: "movie" | "series" | "shared";
  keywords: Keyword[];
};

export type KeywordId = `${string}_${number}`; // GenreName_KeywordTMDBId

export type Keyword = {
  id: KeywordId;
  label: string;
};

type TasteItemsResDto = {
  tasteGenres: TasteGenre[];
};

export const useTasteItems = () => {
  const url = "/constants/taste-items";

  const { data: response, ...rest } = useQueryConfigured<TasteItemsResDto>(url);

  return {
    data: response?.data?.tasteGenres,
    ...rest,
  };
};
