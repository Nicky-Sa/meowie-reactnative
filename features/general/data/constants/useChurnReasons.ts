import { SuccessResponse } from "@/features/common/data/transformers";
import useSWR from "swr";
import { SegmentItem } from "@/features/common/segment";

export type ChurnReasonsResDto = SegmentItem[];

export const useChurnReasons = () => {
  const url = "/constants/churn-reasons";

  const { data: response, ...rest } = useSWR<
    SuccessResponse<ChurnReasonsResDto>,
    Error
  >(url);

  return {
    data: response?.data,
    ...rest,
  };
};
