import { User } from "@/entities/user";
import { useQueryConfigured } from "@/features/common/data/query/hooks";

type CurrentUserResDto = {
  user: User | null;
};

export const useCurrentUser = () => {
  const url = "/auth/current-user";

  const { data: response, ...rest } =
    useQueryConfigured<CurrentUserResDto>(url);

  return {
    data: response?.data,
    ...rest,
  };
};
