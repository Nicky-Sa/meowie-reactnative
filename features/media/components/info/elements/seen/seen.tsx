import { Button } from "@/features/common/ui/button";
import { useMarkAsSeen } from "@/features/media/components/info/elements/seen/data/useMarkAsSeen";
import { useRemoveSeen } from "@/features/media/components/info/elements/seen/data/useRemoveSeen";
import { useUpdateRating } from "@/features/media/components/info/elements/seen/data/useUpdateRating";
import { ID } from "@/features/common/data/media-query";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { View, Text } from "react-native";
import { useFetchLibraryStatus } from "@/features/media/components/info/elements/save/data/useFetchLibraryStatus";
import { useRef, useState } from "react";
import { LoginWarningModal } from "@/features/auth/login-warning-modal";
import { SeenIcon } from "@/features/media/components/info/elements/seen/elements/icon";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";
import { MediaType } from "@/features/common/data/models/media-type";
import EmptySeen from "@/assets/images/profile/empty-seen.svg";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/features/common/ui/bottom-sheet";
import { RATINGS } from "@/features/media/components/info/elements/seen/elements/rating-icons";
import { Icon } from "@/features/common/ui/icon";
import RatingSkip from "@/assets/images/ratings/rating-skip.svg";
import { RatingButton } from "@/features/media/components/info/elements/seen/elements/rating-button";

type Props = {
  id: ID;
  mediaType: MediaType;
  onPress: () => void;
  onRate: (rating: number | null, isFirstTime: boolean) => void;
  onSkip: () => void;
  onRemove: () => void;
};

export const Seen = ({
  id,
  mediaType,
  onPress,
  onRate,
  onSkip,
  onRemove,
}: Props) => {
  const { data: currentUser } = useCurrentUser();
  const { data: libraryStatus, isLoading: isLibraryStatusLoading } =
    useFetchLibraryStatus({ id, mediaType });
  const { markAsSeen } = useMarkAsSeen({ id, mediaType });
  const { removeSeen } = useRemoveSeen({ id, mediaType });
  const { updateRating } = useUpdateRating({ id, mediaType });
  const isSeen = Boolean(libraryStatus?.seen);
  const isSaved = Boolean(libraryStatus?.saved);
  const currentRating = libraryStatus?.rating;
  const showSaveWarning = !isSeen && isSaved;

  const [showLoginModal, setShowLoginModal] = useState(false);
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);

  const handlePress = async () => {
    if (!currentUser?.user) {
      onPress();
      setShowLoginModal(true);
      return;
    }

    // Always open the bottom sheet — for both initial and update flows
    bottomSheetRef.current?.present();
    onPress();
  };

  const handleRate = async (rating: number | null) => {
    bottomSheetRef.current?.dismiss();
    const isFirstTime = !isSeen;
    if (isSeen) {
      await updateRating(rating ?? undefined);
    } else {
      await markAsSeen(rating ?? undefined);
    }

    if (rating === null) {
      onSkip();
    } else {
      onRate(rating, isFirstTime);
    }
  };

  const handleUnseen = async () => {
    bottomSheetRef.current?.dismiss();
    await removeSeen();
    onRemove();
  };

  return (
    <>
      <Button
        variant={"black"}
        size={"md"}
        onPress={handlePress}
        style={{ overflow: "visible" }}
        icon={
          isLibraryStatusLoading ? null : (
            <SeenIcon isSeen={isSeen} rating={currentRating} />
          )
        }
      >
        {isLibraryStatusLoading ? (
          <SkeletonItem className={"h-6 w-16"} />
        ) : (
          "Seen"
        )}
      </Button>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        title={isSeen ? "Update Rating" : `Rate this ${mediaType}`}
        enableDynamicSizing
        footer={
          isSeen ? (
            // Already seen: let the user remove it
            <Button variant={"ghost"} size={"lg"} onPress={handleUnseen}>
              {`Remove this ${mediaType} from seen list`}
            </Button>
          ) : (
            // First time: let the user skip rating
            <Button
              variant={"ghost"}
              size={"lg"}
              onPress={() => handleRate(null)}
              icon={<Icon i={RatingSkip} />}
            >
              Skip rating
            </Button>
          )
        }
      >
        <View className="flex flex-col gap-6">
          {showSaveWarning && (
            <Text className="body-b2 text-neutral-10-default opacity-60">
              This action will remove the item from your saved list and add it
              to your watched history.
            </Text>
          )}
          <View className="flex flex-row items-center justify-center gap-2">
            {RATINGS.map(({ value, icon }) => {
              const isSelected = currentRating === value;
              return (
                <RatingButton
                  key={value}
                  value={value}
                  handleRate={handleRate}
                  isSelected={isSelected}
                  icon={icon}
                />
              );
            })}
          </View>
        </View>
      </BottomSheet>

      <LoginWarningModal
        img={EmptySeen}
        text={"You'll need an account to track what you've seen."}
        modalVisible={showLoginModal}
        setModalVisible={setShowLoginModal}
      />
    </>
  );
};
