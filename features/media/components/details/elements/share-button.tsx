import { ShareIos } from "iconoir-react-native";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { MediaType } from "@/features/common/data/models/media-type";
import { useShareMedia } from "@/features/media/hooks/use-share-media";

type Props = {
  mediaType: MediaType;
  id: string;
};

export const ShareButton = ({ mediaType, id }: Props) => {
  const shareMedia = useShareMedia({ mediaType, id });

  return (
    <Button
      onPress={shareMedia}
      variant={"ghost"}
      size={"md"}
      iconPosition={"only"}
      icon={<Icon i={ShareIos} />}
    />
  );
};
