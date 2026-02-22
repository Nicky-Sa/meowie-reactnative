import { useSWRConfigured } from "@/features/common/data/swr/hooks";

export type Genre = {
  id: number;
  name: string;
  emoji: string;
};

type GenresResDto = {
  movieGenres: Genre[];
  seriesGenres: Genre[];
};

export const useGenres = () => {
  const url = "/constants/genres";

  const { data: response, ...rest } = useSWRConfigured<GenresResDto>(url);

  return {
    data: response?.data,
    ...rest,
  };
};
