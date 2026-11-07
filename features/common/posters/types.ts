import { PosterInfo } from "@/features/common/data/models/poster";
import { ID } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";

export type PostersUrl =
  | `/person/${string}/posters`
  | `/${MediaType}/posters`
  | "/library/saved"
  | "/library/seen"
  | `/collections/${string}/items`
  | `/explore/${MediaType}/tabs/${string}`
  | `/${MediaType}/${ID}/recommendations/posters`;

export type PosterHookResult = {
  data: PosterInfo[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};
