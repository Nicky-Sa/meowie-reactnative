import { MediaType } from "@/features/common/data/models/media-type";

export type MediaListItemData = {
  id: number;
  mediaType: MediaType;
  batchIndex?: number;
  roleInMedia?: string;
  // Non-media page injected into the list.
  card?: "share-taste";
};
