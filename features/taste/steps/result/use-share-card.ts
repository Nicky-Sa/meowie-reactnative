import { useRef } from "react";
import { View, Share, Platform } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { ResolvedPersonality } from "@/features/taste/data/dto/taste.dto";

const shareLine = (personality: ResolvedPersonality) =>
  personality.isOmnivore
    ? `My Meowie type: ${personality.name}.`
    : `On Meowie I watch like ${personality.name} (from ${personality.source}).`;

/**
 * Snapshots the card the returned ref is attached to and opens the OS share
 * sheet with the PNG and the line together, falling back to the line on its
 * own when the snapshot or the share sheet is unavailable.
 */
export const useShareCard = (personality: ResolvedPersonality) => {
  const cardRef = useRef<View>(null);

  const share = async () => {
    const message = shareLine(personality);

    try {
      const uri = await captureRef(cardRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });
      const fileUri = uri.startsWith("/") ? `file://${uri}` : uri;

      // Only iOS carries both in one sheet — RN's Share ignores `url` on
      // Android, and expo-sharing has no way to attach the line, so Android
      // sends the card alone.
      if (Platform.OS === "ios") {
        await Share.share({ message, url: fileUri });
        return;
      }
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "image/png",
          UTI: "public.png",
          dialogTitle: "Share your Meowie type",
        });
        return;
      }
    } catch {
      // Capture/share can fail (e.g. permissions, no share sheet) — fall back.
    }

    await Share.share({ message });
  };

  return { cardRef, share };
};
