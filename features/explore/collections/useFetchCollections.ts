import { useQueryConfigured } from "@/features/common/data/query/hooks";
import { CollectionResDto } from "./collection.dto";

export const useFetchCollections = (parentId?: number) => {
  const url =
    parentId != null ? `/collections?parentId=${parentId}` : "/collections";
  return useQueryConfigured<CollectionResDto[]>(url);
};
