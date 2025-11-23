import { SuccessResponse } from "@/features/common/data/transformers";
import { fetcher } from "@/features/common/data/fetcher";
import useSWR from "swr";
import { SegmentItem } from "@/features/common/segment";

export type ChurnReasonsResDto = SegmentItem[];

export const useChurnReasons = () => {
  const url = "/constants/churn-reasons";

  const { data: response, ...rest } = useSWR<
    SuccessResponse<ChurnReasonsResDto>,
    Error
  >(url, fetcher);

  return {
    data: response?.data,
    ...rest,
  };
};
