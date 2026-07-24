import { useRef, useState } from "react";
import { Platform, Share } from "react-native";
import * as Sharing from "expo-sharing";
import { File, Paths } from "expo-file-system";
import { Personality } from "@/features/taste/data/dto/taste.dto";

const CARD_FILE_NAME = "meowie-taste-card.png";

/**
 * Shares and saves the personality card. The card comes down from S3 as a
 * finished picture, so both buttons work on the file itself — nothing is drawn
 * on the phone.
 */
export const useCardImage = (personality: Personality) => {
  const downloaded = useRef<File>(null);
  const [isSharing, setIsSharing] = useState(false);

  const cardFile = async (): Promise<File> => {
    if (downloaded.current?.exists) {
      return downloaded.current;
    }

    const target = new File(Paths.cache, CARD_FILE_NAME);
    if (target.exists) {
      target.delete();
    }

    downloaded.current = await File.downloadFileAsync(
      personality.image,
      target,
    );
    return downloaded.current;
  };

  const share = async () => {
    setIsSharing(true);
    const message = `My Meowie type: ${personality.name}.`;

    try {
      const file = await cardFile();

      // Only iOS carries the picture and the line in one sheet — RN's Share
      // ignores `url` on Android, and expo-sharing has no way to attach the
      // line, so Android sends the card on its own.
      if (Platform.OS === "ios") {
        await Share.share({ message, url: file.uri });
      } else if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "image/png",
          UTI: "public.png",
          dialogTitle: "Share your Meowie type",
        });
      } else {
        await Share.share({ message });
      }
    } catch {
      // The download or the share sheet can fail — send the line on its own.
      await Share.share({ message });
    } finally {
      setIsSharing(false);
    }
  };

  return { share, isSharing };
};
