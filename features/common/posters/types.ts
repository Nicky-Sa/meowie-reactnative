import { PosterInfo } from "@/features/common/data/models/poster";

export type PosterHookResult = {
  data: PosterInfo[];
  dataLength: number;
  totalPages: number;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  size: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};
