import { MediaType } from "@/features/common/data/models/media-type";

export type MediaListItemData = {
  id: number;
  mediaType: MediaType;
  deliveryIndex?: number;
  roleInMedia?: string;
  tag?: string;
  // Non-media page injected into the list.
  card?: "share-taste";
};
