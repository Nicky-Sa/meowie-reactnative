import { PosterInfo } from "@/features/common/data/models/poster";

export type PosterHookResult = {
  data: PosterInfo[];
  dataLength: number;
  totalPages: number;
  size: number;
  setSize: (size: number | ((size: number) => number)) => void;
  isLoading: boolean;
  isValidating: boolean;
  error: Error | undefined;
  mutate: () => void;
};
