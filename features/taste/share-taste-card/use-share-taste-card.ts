import { useCallback } from "react";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { MediaListItemData } from "@/features/media/components/list/types";
import { MediaType } from "@/features/common/data/models/media-type";
import { useAtomValue } from "jotai";
import { tasteAtom } from "@/atoms";

const CARD_INDEX = 3;
const SHARE_TASTE_CARD_ID = -1;

/**
 * Injects the "Not finding your vibe?" card into a feed list for users
 * without a taste profile (guests included).
 */
export const useShareTasteCard = () => {
  const { data, isPending: isCurrentUserPending } = useCurrentUser();
  const taste = useAtomValue(tasteAtom);

  const user = data?.user;
  const showCard =
    !isCurrentUserPending && !user?.hasFilledInTaste && !taste.completed;

  const withShareTasteCard = useCallback(
    (items: MediaListItemData[], mediaType: MediaType): MediaListItemData[] => {
      if (!showCard || items.length < CARD_INDEX) return items;
      return [
        ...items.slice(0, CARD_INDEX),
        { id: SHARE_TASTE_CARD_ID, mediaType, card: "share-taste" },
        ...items.slice(CARD_INDEX),
      ];
    },
    [showCard],
  );

  return { withShareTasteCard };
};
