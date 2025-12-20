import { SegmentItem } from "@/features/common/segment";
import { useSWRConfigured } from "@/features/common/data/swr-config";

export type ChurnReasonsResDto = SegmentItem[];

export const useChurnReasons = () => {
  const url = "/constants/churn-reasons";

  const { data: response, ...rest } = useSWRConfigured<ChurnReasonsResDto>(url);

  return {
    data: response?.data,
    ...rest,
  };
};
