import { PosterInfo } from "@/features/common/data/models/poster";

export type PosterHookResult = {
  data: PosterInfo[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};
