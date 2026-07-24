import { useCallback } from "react";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { MediaListItemData } from "@/features/media/components/list/types";
import { MediaType } from "@/features/common/data/models/media-type";

// The card takes the feed page after this many swipes: third page for guests,
// tenth for logged-in users who still have no taste.
const GUEST_CARD_INDEX = 2;
const LOGGED_IN_CARD_INDEX = 9;
export const VIBE_CARD_ID = -1;

/**
 * Injects the "Not finding your vibe?" card into a feed list for users
 * without a taste profile (guests included).
 */
export const useVibeCard = () => {
  const { data } = useCurrentUser();

  const user = data?.user;
  const show = !user?.hasFilledInTaste;
  const cardIndex = user ? LOGGED_IN_CARD_INDEX : GUEST_CARD_INDEX;

  const withVibeCard = useCallback(
    (items: MediaListItemData[], mediaType: MediaType): MediaListItemData[] => {
      if (!show || items.length < cardIndex) return items;
      return [
        ...items.slice(0, cardIndex),
        { id: VIBE_CARD_ID, mediaType, card: "taste-vibe" },
        ...items.slice(cardIndex),
      ];
    },
    [show, cardIndex],
  );

  return { withVibeCard };
};
