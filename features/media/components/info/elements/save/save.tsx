import { Button } from "@/features/common/ui/button";
import { useMarkAsSaved } from "@/features/media/components/info/elements/save/data/use-mark-as-saved";
import { useRemoveSaved } from "@/features/media/components/info/elements/save/data/use-remove-saved";
import { ID } from "@/features/common/data/media-query";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { View, Text } from "react-native";
import { useFetchLibraryStatus } from "@/features/media/components/info/elements/save/data/use-fetch-library-status";
import { useState, useRef, useEffect, useEffectEvent } from "react";
import Toast from "react-native-toast-message";
import { useLocalSearchParams } from "expo-router";
import { SaveIcon } from "@/features/media/components/info/elements/save/elements/icon";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";
import { LoginWarningModal } from "@/features/auth/components/login-warning-modal";
import EmptySaved from "@/assets/images/meowie/empty-saved.svg";

import { MediaType } from "@/features/common/data/models/media-type";
import { MediaAction } from "@/features/media/data/media-actions";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/features/common/ui/bottom-sheet";

type Props = {
  id: ID;
  mediaType: MediaType;
  onPress: (saved: boolean | null) => void;
};

export const Save = ({ id, mediaType, onPress }: Props) => {
  const { action } = useLocalSearchParams<{ action?: MediaAction }>();
  const { data: currentUser, isPending: isCurrentUserPending } =
    useCurrentUser();
  const { data: libraryStatus, isLoading: isLibraryStatusLoading } =
    useFetchLibraryStatus({ id, mediaType });
  const { markAsSaved } = useMarkAsSaved({ id, mediaType });
  const { removeSaved } = useRemoveSaved({ id, mediaType });
  const isSaved = Boolean(libraryStatus?.saved);
  const isSeen = Boolean(libraryStatus?.seen);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);

  const handlePress = async () => {
    if (!currentUser?.user) {
      onPress(null);
      setShowLoginModal(true);
      return;
    }

    if (isSaved) {
      await removeSaved();
      onPress(false);
    } else if (isSeen) {
      bottomSheetRef.current?.present();
    } else {
      await markAsSaved();
      onPress(true);
    }
  };

  const runSaveAction = useEffectEvent(() => {
    // Unlike a tap, the action never removes a saved title.
    if (isSaved) {
      Toast.show({
        type: "info",
        text1: `This ${mediaType} is already in your saved list`,
      });
      return;
    }

    handlePress().catch((error) => {
      console.error("Could not run the save action:", error);
    });
  });

  // Runs again after a guest logs in from the prompt, so the save still happens.
  useEffect(() => {
    if (action !== "save" || isCurrentUserPending || isLibraryStatusLoading)
      return;
    runSaveAction();
  }, [action, isCurrentUserPending, isLibraryStatusLoading]);

  const handleConfirmMove = async () => {
    bottomSheetRef.current?.dismiss();
    await markAsSaved();
    onPress(true);
  };

  return (
    <>
      <Button
        variant={"black"}
        size={"md"}
        onPress={handlePress}
        disabled={isLibraryStatusLoading}
        icon={isLibraryStatusLoading ? null : <SaveIcon isSaved={isSaved} />}
        className={"min-w-20"}
      >
        {isLibraryStatusLoading ? (
          <SkeletonItem className={"h-6 w-16"} />
        ) : (
          <Text
            className={
              "body-b2-strong ml-0.5 w-10 text-left text-neutral-10-default"
            }
          >
            {isSaved ? "Saved" : "Save"}
          </Text>
        )}
      </Button>

      <BottomSheet
        ref={bottomSheetRef}
        title="Move to Saved?"
        index={0}
        enableDynamicSizing
        footer={
          <Button variant="white" onPress={handleConfirmMove}>
            Yes, move to saved
          </Button>
        }
      >
        <View className="flex flex-col gap-8">
          <Text className="body-b1 text-neutral-10-default">
            You&#39;ve already marked this as seen. Saving it now will remove it
            from your history and clear your rating.
          </Text>
        </View>
      </BottomSheet>

      <LoginWarningModal
        img={EmptySaved}
        text={
          "You'll need an account to keep track of movies you want to watch."
        }
        modalVisible={showLoginModal}
        setModalVisible={setShowLoginModal}
      />
    </>
  );
};
