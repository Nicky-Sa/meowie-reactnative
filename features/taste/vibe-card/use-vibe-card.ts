import { useCallback } from "react";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { MediaListItemData } from "@/features/media/components/list/types";
import { MediaType } from "@/features/common/data/models/media-type";

// The card takes the feed page after this many swipes.
const VIBE_CARD_INDEX = 15;
export const VIBE_CARD_ID = -1;

/**
 * Injects the "Not finding your vibe?" card into a feed list for users
 * without a taste profile (guests included).
 */
export const useVibeCard = () => {
  const { data } = useCurrentUser();

  const show = !data?.user?.hasFilledInTaste;

  const withVibeCard = useCallback(
    (items: MediaListItemData[], mediaType: MediaType): MediaListItemData[] => {
      if (!show || items.length < VIBE_CARD_INDEX) return items;
      return [
        ...items.slice(0, VIBE_CARD_INDEX),
        { id: VIBE_CARD_ID, mediaType, card: "taste-vibe" },
        ...items.slice(VIBE_CARD_INDEX),
      ];
    },
    [show],
  );

  return { withVibeCard };
};
