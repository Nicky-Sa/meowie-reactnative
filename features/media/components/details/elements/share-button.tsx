import { Share } from "react-native";
import Toast from "react-native-toast-message";
import { ShareIos } from "iconoir-react-native";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { MediaType } from "@/features/common/data/models/media-type";
import { getShareLink } from "@/features/media/data/share-links";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

type Props = {
  mediaType: MediaType;
  id: string;
};

export const ShareButton = ({ mediaType, id }: Props) => {
  const { media } = useAnalytics();

  const onPress = async () => {
    try {
      const result = await Share.share({ url: getShareLink(mediaType, id) });
      if (result.action === Share.sharedAction) {
        media.trackShare({ mediaId: id, mediaType });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed to open sharing" });
      console.error(error);
    }
  };

  return (
    <Button
      onPress={onPress}
      variant={"ghost"}
      size={"md"}
      iconPosition={"only"}
      icon={<Icon i={ShareIos} />}
    />
  );
};
