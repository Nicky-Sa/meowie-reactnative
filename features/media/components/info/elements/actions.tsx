import { View } from "react-native";
import { Save } from "@/features/media/components/info/elements/save/save";
import { Seen } from "@/features/media/components/info/elements/seen/seen";
import { GoToDetails } from "@/features/media/components/details/elements/go-to-details";
import { MediaType } from "@/features/common/data/models/media-type";
import { ID } from "@/features/common/data/media-query";
import { TourStep } from "@/features/common/ui/tour/steps";
import { Tourable } from "@/features/common/ui/tour/tourable";

type Props = {
  mediaId: ID;
  mediaType: MediaType;
  tourEnabled?: boolean;
  onSavePress: (saved: boolean | null) => void;
  onSeenPress: () => void;
  onRate: (rating: number | null, isFirstTime: boolean) => void;
  onSkipRating: () => void;
  onRemoveSeen: () => void;
};

export const Actions = ({
  mediaId,
  mediaType,
  tourEnabled,
  onSavePress,
  onSeenPress,
  onRate,
  onSkipRating,
  onRemoveSeen,
}: Props) => {
  return (
    <View className={"mt-4 flex flex-row items-center justify-between"}>
      <View className={"flex flex-row items-center justify-start gap-2"}>
        <Tourable
          tourEnabled={tourEnabled}
          tour={{
            step: TourStep.MediaSave,
            shape: "rectangle",
            borderRadius: 14,
          }}
        >
          <Save id={mediaId} mediaType={mediaType} onPress={onSavePress} />
        </Tourable>
        <Tourable
          tourEnabled={tourEnabled}
          tour={{
            step: TourStep.MediaSeen,
            shape: "rectangle",
            borderRadius: 14,
          }}
        >
          <Seen
            id={mediaId}
            mediaType={mediaType}
            onPress={onSeenPress}
            onRate={onRate}
            onSkip={onSkipRating}
            onRemove={onRemoveSeen}
          />
        </Tourable>
      </View>
      <GoToDetails id={mediaId} mediaType={mediaType} />
    </View>
  );
};
