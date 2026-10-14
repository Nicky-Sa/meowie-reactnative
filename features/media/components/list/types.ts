import { MediaType } from "@/features/common/data/models/media-type";

export type MediaListItemData = {
  id: number;
  mediaType: MediaType;
  roleInMedia?: string;
  // Non-media page injected into the list (e.g. the share taste card).
  card?: "share-taste";
};
