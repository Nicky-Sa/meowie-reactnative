import { useQueryConfigured } from "@/features/common/data/query/hooks";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { TasteResDto } from "@/features/taste/data/dto/upsert-taste.dto";

export const useFetchTaste = () => {
  const { data: currentUser } = useCurrentUser();
  const isLoggedIn = !!currentUser?.user;

  const { data: response, ...rest } = useQueryConfigured<TasteResDto | null>(
    "/taste",
    {
      enabled: isLoggedIn,
    },
  );

  return {
    data: response?.data ?? null,
    ...rest,
  };
};
