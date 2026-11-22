import { View } from "react-native";
import { Save } from "@/features/media/components/info/elements/save/save";
import { Seen } from "@/features/media/components/info/elements/seen/seen";
import { GoToDetails } from "@/features/media/components/details/elements/go-to-details";
import { MediaType } from "@/features/common/data/models/media-type";
import { ID } from "@/features/common/data/media-query";

type Props = {
  mediaId: ID;
  mediaType: MediaType;
  onSavePress: (saved: boolean | null) => void;
  onSeenPress: () => void;
  onRate: (rating: number | null, isFirstTime: boolean) => void;
  onSkipRating: (isFirstTime: boolean) => void;
  onRemoveSeen: () => void;
};

export const Actions = ({
  mediaId,
  mediaType,
  onSavePress,
  onSeenPress,
  onRate,
  onSkipRating,
  onRemoveSeen,
}: Props) => {
  return (
    <View className={"flex flex-row items-center justify-between"}>
      <View className={"flex flex-row items-center justify-start gap-2"}>
        <Save id={mediaId} mediaType={mediaType} onPress={onSavePress} />
        <Seen
          id={mediaId}
          mediaType={mediaType}
          onPress={onSeenPress}
          onRate={onRate}
          onSkip={onSkipRating}
          onRemove={onRemoveSeen}
        />
      </View>
      <GoToDetails id={mediaId} mediaType={mediaType} />
    </View>
  );
};
