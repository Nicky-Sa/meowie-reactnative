import { useQueryConfigured } from "@/features/common/data/query/hooks";
import { TasteResDto } from "@/features/taste/data/dto/taste.dto";

export const useFetchTaste = ({ enabled }: { enabled: boolean }) => {
  const url = "/taste";

  const { data: response, ...rest } = useQueryConfigured<TasteResDto | null>(
    url,
    { enabled },
  );

  return { data: response?.data, ...rest };
};
