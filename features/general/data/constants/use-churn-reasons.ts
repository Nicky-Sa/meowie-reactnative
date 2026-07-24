import { useQueryConfigured } from "@/features/common/data/query/hooks";
import { Option } from "@/features/common/option";

type ChurnReason = Option;

type ChurnReasonsResDto = { reasons: ChurnReason[] };

export const useChurnReasons = () => {
  const url = "/user/churn-reasons";

  const { data: response, ...rest } =
    useQueryConfigured<ChurnReasonsResDto>(url);

  return {
    data: response?.data,
    ...rest,
  };
};
