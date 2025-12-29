import { useSWRConfigured } from "@/features/common/data/swr-config";

export type Genre = {
  id: number;
  name: string;
  emoji: string;
};

type GenresResDto = {
  genres: Genre[];
};

export const useGenres = () => {
  const url = "/constants/genres";

  const { data: response, ...rest } = useSWRConfigured<GenresResDto>(url);

  return {
    data: response?.data,
    ...rest,
  };
};
