import { useAtom } from "jotai/index";
import { filtersAtom, sortAtom } from "@/atoms";

export const useQueryKey = () => {
  const [filters] = useAtom(filtersAtom);
  const [sort] = useAtom(sortAtom);
  return JSON.stringify({ ...filters, sort });
};
