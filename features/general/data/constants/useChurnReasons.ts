import { useSWRConfigured } from "@/features/common/data/swr/hooks";

type ChurnReason = {
  id: string;
  label: string;
};

type ChurnReasonsResDto = { reasons: ChurnReason[] };

export const useChurnReasons = () => {
  const url = "/constants/churn-reasons";

  const { data: response, ...rest } = useSWRConfigured<ChurnReasonsResDto>(url);

  return {
    data: response?.data,
    ...rest,
  };
};
