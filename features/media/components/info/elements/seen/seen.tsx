import { Button } from "@/features/common/ui/button";
import { useMarkAsSeen } from "@/features/media/components/info/elements/seen/data/use-mark-as-seen";
import { useRemoveSeen } from "@/features/media/components/info/elements/seen/data/use-remove-seen";
import { useUpdateRating } from "@/features/media/components/info/elements/seen/data/use-update-rating";
import { ID } from "@/features/common/data/media-query";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { View, Text } from "react-native";
import { useFetchLibraryStatus } from "@/features/media/components/info/elements/save/data/use-fetch-library-status";
import { useRef, useState } from "react";
import { LoginWarningModal } from "@/features/auth/components/login-warning-modal";
import { SeenIcon } from "@/features/media/components/info/elements/seen/elements/icon";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";
import { MediaType } from "@/features/common/data/models/media-type";
import EmptySeen from "@/assets/images/meowie/empty-seen.svg";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/features/common/ui/bottom-sheet";
import {
  DEFAULT_RATING,
  RatingSlider,
} from "@/features/media/components/info/elements/seen/elements/rating-slider";
import { RatingSliderLottie } from "@/features/media/components/info/elements/seen/elements/rating-slider-lottie";

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
  const [pickedRating, setPickedRating] = useState<number | null>(
    DEFAULT_RATING,
  );
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);

  const handlePress = async () => {
    if (!currentUser?.user) {
      onPress();
      setShowLoginModal(true);
      return;
    }

    // An item that was seen but never rated keeps Skip; a new one starts at the
    // top of the scale.
    setPickedRating(isSeen ? (currentRating ?? null) : DEFAULT_RATING);

    // Always open the bottom sheet — for both initial and update flows
    bottomSheetRef.current?.present();
    onPress();
  };

  const handleRate = async (rating: number | null) => {
    bottomSheetRef.current?.dismiss();
    const isFirstTime = !isSeen;
    if (isSeen) {
      await updateRating(rating);
    } else {
      await markAsSeen(rating);
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
        disabled={isLibraryStatusLoading}
        style={{ overflow: "visible" }}
        className={"min-w-20"}
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
          <View className="flex flex-col gap-2">
            <Button
              variant={"white"}
              size={"lg"}
              onPress={() => handleRate(pickedRating)}
            >
              Submit
            </Button>
            {isSeen && (
              <Button variant={"ghost"} size={"lg"} onPress={handleUnseen}>
                {`Unseen this ${mediaType}`}
              </Button>
            )}
          </View>
        }
      >
        <View className="flex flex-col">
          {showSaveWarning && (
            <Text className="body-b2 text-neutral-10-default opacity-60">
              This action will remove the item from your saved list and add it
              to your watched history.
            </Text>
          )}
          <View className="items-center">
            <RatingSliderLottie value={pickedRating} />
          </View>

          <Text className="body-b2 text-center text-neutral-10-default opacity-60">
            {pickedRating === null ? "Skip rating" : ""}
          </Text>

          {/* Bleed past the sheet padding so the far choices fade at the edges */}
          <View className="-mx-4 my-4">
            <RatingSlider value={pickedRating} onChange={setPickedRating} />
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
