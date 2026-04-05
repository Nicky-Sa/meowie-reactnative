import { useQueryConfigured } from "@/features/common/data/query/hooks";

type ChurnReason = {
  id: string;
  label: string;
};

type ChurnReasonsResDto = { reasons: ChurnReason[] };

export const useChurnReasons = () => {
  const url = "/constants/churn-reasons";

  const { data: response, ...rest } =
    useQueryConfigured<ChurnReasonsResDto>(url);

  return {
    data: response?.data,
    ...rest,
  };
};
