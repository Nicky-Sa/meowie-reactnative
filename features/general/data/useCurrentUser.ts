import { User } from "@/entities/user";
import { useSWRConfigured } from "@/features/common/data/swr-config";

type CurrentUserResDto = {
  user: User | null;
};

export const useCurrentUser = () => {
  const url = "/auth/current-user";

  const { data: response, ...rest } = useSWRConfigured<CurrentUserResDto>(url);

  return {
    data: response?.data,
    ...rest,
  };
};
