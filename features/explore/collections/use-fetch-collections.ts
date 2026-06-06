import { useQueryConfigured } from "@/features/common/data/query/hooks";
import { CollectionResDto } from "./collection.dto";

export const useFetchCollections = (parentId?: number) => {
  const url =
    parentId != null ? `/collections?parentId=${parentId}` : "/collections";
  const { data: response, ...rest } =
    useQueryConfigured<CollectionResDto[]>(url);

  return {
    data: response?.data,
    ...rest,
  };
};
