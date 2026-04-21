import { Button } from "@/features/common/ui/button";
import { useMarkAsSaved } from "@/features/media/components/details/elements/save/data/useMarkAsSaved";
import { useRemoveSaved } from "@/features/media/components/details/elements/save/data/useRemoveSaved";
import { ID } from "@/features/common/data/media-query";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { View, Text } from "react-native";
import { useFetchLibraryStatus } from "@/features/media/components/details/elements/save/data/useFetchLibraryStatus";
import { useState, useRef } from "react";
import { InformationModal } from "@/features/common/information-modal";
import EmptySaved from "@/assets/images/profile/empty-saved.svg";
import { useRouter } from "expo-router";
import { SaveIcon } from "@/features/media/components/details/elements/save/icon";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";

import { MediaType } from "@/features/common/data/models/media-type";
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
  const { data: currentUser } = useCurrentUser();
  const { data: libraryStatus, isLoading: isLibraryStatusLoading } =
    useFetchLibraryStatus({ id, mediaType });
  const { markAsSaved } = useMarkAsSaved({ id, mediaType });
  const { removeSaved } = useRemoveSaved({ id, mediaType });
  const isSaved = Boolean(libraryStatus?.saved);
  const isSeen = Boolean(libraryStatus?.seen);

  const router = useRouter();
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

  const handleConfirmMove = async () => {
    bottomSheetRef.current?.dismiss();
    await markAsSaved();
    onPress(true);
  };

  return (
    <>
      <Button variant={"link"} size={"md"} onPress={handlePress}>
        <View className={"flex flex-row items-center justify-center gap-2"}>
          {isLibraryStatusLoading ? (
            <SkeletonItem className={"h-6 w-16"} />
          ) : (
            <>
              <SaveIcon isSaved={isSaved} />
              <Text className={"body-b2-strong w-10 text-neutral-10-default"}>
                {isSaved ? "Saved" : "Save"}
              </Text>
            </>
          )}
        </View>
      </Button>

      <BottomSheet
        ref={bottomSheetRef}
        title="Move to Saved?"
        index={0}
        snapPoints={["32%"]}
        enableDynamicSizing={false}
      >
        <View className="flex flex-col gap-8">
          <Text className="body-b1 text-neutral-10-default">
            You&#39;ve already marked this as seen. Saving it now will remove it
            from your history and clear your rating.
          </Text>
          <Button variant="white" onPress={handleConfirmMove}>
            Yes, move to saved
          </Button>
        </View>
      </BottomSheet>

      <InformationModal
        img={EmptySaved}
        informationText={
          "You'll need an account to keep track of movies you want to watch."
        }
        modalVisible={showLoginModal}
        setModalVisible={setShowLoginModal}
      >
        <Button
          onPress={() => {
            router.push("/auth/request-otp");
            setShowLoginModal(false);
          }}
          variant={"white"}
          size={"md"}
          className={"w-full"}
        >
          Login or Sign Up
        </Button>
      </InformationModal>
    </>
  );
};
