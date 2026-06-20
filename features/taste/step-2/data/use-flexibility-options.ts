import { useQueryConfigured } from "@/features/common/data/query/hooks";

export type FlexibilityOption = {
  id: string;
  label: string;
};

type FlexibilityOptionsResDto = {
  flexibilityOptions: FlexibilityOption[];
};

export const useFlexibilityOptions = () => {
  const url = "/taste/flexibility-options";

  const { data: response, ...rest } =
    useQueryConfigured<FlexibilityOptionsResDto>(url);

  return {
    data: response?.data?.flexibilityOptions,
    ...rest,
  };
};
