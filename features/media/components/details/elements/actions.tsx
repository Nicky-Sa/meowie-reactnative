import { View } from "react-native";
import { Save } from "@/features/media/components/info/elements/save/save";
import { Seen } from "@/features/media/components/info/elements/seen/seen";
import { ID } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";

type Props = {
  id: ID;
  mediaType: MediaType;
  onSavePress: (saved: boolean | null) => void;
  onSeenPress: () => void;
  onRate: (rating: number | null, isFirstTime: boolean) => void;
  onSkipRating: (isFirstTime: boolean) => void;
  onRemoveSeen: () => void;
};

export const Actions = ({
  id,
  mediaType,
  onSavePress,
  onSeenPress,
  onRate,
  onSkipRating,
  onRemoveSeen,
}: Props) => {
  return (
    <View className={"flex flex-row gap-2"}>
      <View className={"flex-1"}>
        <Save id={id} mediaType={mediaType} onPress={onSavePress} />
      </View>
      <View className={"flex-1"}>
        <Seen
          id={id}
          mediaType={mediaType}
          onPress={onSeenPress}
          onRate={onRate}
          onSkip={onSkipRating}
          onRemove={onRemoveSeen}
        />
      </View>
    </View>
  );
};
